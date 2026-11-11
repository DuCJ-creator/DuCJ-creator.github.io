#!/usr/bin/env python3
"""Build the static AWL dataset from the supplied and official source PDFs."""

from __future__ import annotations

import json
import re
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PDF = Path("/Users/shirleydcj/Downloads/academic word list.pdf")
FAMILIES_PDF = Path("/tmp/awlsublists1.pdf")
DICTIONARY = Path("/tmp/dump_by_word.json")
TOEFL = Path("/tmp/toefl_vocab.json")


def attached_headwords() -> list[list[str]]:
    reader = PdfReader(SOURCE_PDF)
    page_groups = [(0, 1), (2, 3), (4, 5), (6, 7), (8, 9),
                   (10, 11), (12, 13), (14, 15), (16, 17), (18,)]
    skip_phrases = (
        "Sublist", "This sublist", "Academic Corpus", "listed below",
        "from the Academic", "of the Academic", "the Academic Word List",
    )
    result: list[list[str]] = []
    for pages in page_groups:
        words: list[str] = []
        for page_no in pages:
            for raw in (reader.pages[page_no].extract_text() or "").splitlines():
                line = raw.strip()
                if not line or any(p in line for p in skip_phrases):
                    continue
                if "most frequent" in line or "most freq" in line or "families" in line:
                    continue
                if line == "distorted/distortion - equal figures":
                    line = "distortion"
                if re.fullmatch(r"[A-Za-z][A-Za-z-]*", line):
                    words.append(line.lower())
        result.append(words)
    assert [len(x) for x in result] == [60] * 9 + [30], [len(x) for x in result]
    return result


def official_families() -> list[list[str]]:
    reader = PdfReader(FAMILIES_PDF)
    groups: list[list[str]] = []
    current: list[str] | None = None
    ignored = {"academic corpus", "for example", "british and american spelling"}

    for page in reader.pages:
        fragments: list[tuple[str, float, float]] = []

        def visit(text, cm, tm, font, size):
            cleaned = " ".join(text.split())
            if cleaned:
                fragments.append((cleaned, float(tm[4]), float(tm[5])))

        page.extract_text(visitor_text=visit)
        lines: list[tuple[str, float, float]] = []
        for text, x, y in fragments:
            if lines and abs(lines[-1][2] - y) < 0.5 and 0 <= x - lines[-1][1] < 100:
                old, old_x, old_y = lines[-1]
                lines[-1] = (old + text, old_x, old_y)
            else:
                lines.append((text, x, y))

        for text, x, y in lines:
            low = text.lower().strip(" .")
            if not re.fullmatch(r"[a-z]{2,}(?:-[a-z]+)?", low):
                continue
            if low in ignored or low in {"analysis", "analyse", "contextualise", "contextualize", "context"} and y > 670:
                continue
            is_start = (65 <= x <= 90) or (225 <= x <= 250) or (388 <= x <= 410)
            if is_start:
                current = [low]
                groups.append(current)
            elif current is not None:
                current.append(low)

    # Preserve order while removing accidental duplicates caused by split text extraction.
    cleaned_groups: list[list[str]] = []
    for group in groups:
        seen: set[str] = set()
        cleaned = []
        for word in group:
            if word not in seen:
                cleaned.append(word)
                seen.add(word)
        cleaned_groups.append(cleaned)
    assert len(cleaned_groups) == 570, len(cleaned_groups)
    return cleaned_groups


def sentence_case(text: str) -> str:
    text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", text)).strip()
    return text[:1].upper() + text[1:] if text else text


def likely_pos(word: str) -> str | None:
    adjective_words = {"consistent", "similar", "major", "normal", "positive", "potential", "previous", "primary", "relevant", "specific", "final", "overall", "prior", "prime", "aware", "brief", "contrary", "sole", "odd", "ongoing", "straightforward"}
    verb_words = {"assume", "create", "occur", "indicate", "require", "achieve", "affect", "conduct", "design", "focus", "impact", "purchase", "range", "select", "transfer", "ensure", "link", "shift", "access", "debate", "grant", "label", "project", "stress", "contact", "decline", "draft", "enable", "target", "pursue", "monitor", "challenge", "alter", "display", "exceed", "trace", "transport", "advocate", "aid", "channel", "file", "grade", "guarantee", "insert", "release", "reverse", "survive", "abandon", "chart", "offset", "schedule", "trigger", "collapse", "encounter", "levy", "panel", "undergo"}
    if word in adjective_words:
        return "adjective"
    if word in verb_words:
        return "verb"
    if word.endswith("ly") and word not in {"family", "utility"}:
        return "adverb"
    if word.endswith(("tion", "sion", "ment", "ness", "ity", "ism", "ance", "ence", "ship", "ology", "graphy")):
        return "noun"
    if word.endswith(("able", "ible", "al", "ial", "ous", "ive", "ical", "ic", "ary", "ory", "ful", "less", "ent", "ant")):
        return "adjective"
    if word.endswith("ed"):
        return "verb"
    return None


def choose_dictionary_meaning(entry: dict, word: str) -> dict:
    candidates = entry.get("meanings") or []
    preferred = {
        "noun": 6, "verb": 5, "adjective": 4, "adverb": 3,
        "conjunction": 2, "preposition": 2,
    }
    expected = likely_pos(word)
    positive = ("study", "system", "method", "process", "information", "theory", "policy",
                "research", "economic", "social", "legal", "scientific", "data", "result",
                "finance", "statement", "contradiction", "evidence", "amount", "effect", "related",
                "act of", "state of", "a way", "a person", "a group", "general")
    negative = ("obsolete", "archaic", "slang", "dated", "sexual", "baseball", "cricket",
                "military post", "fortification", "plural)", "church", "sacrament", "club or society",
                "theatre", "disease")
    sense_hints = {
        "create": ("bring into existence",), "legal": ("law", "lawful"),
        "major": ("important", "greater"), "normal": ("usual", "expected"),
        "positive": ("greater than zero", "favourable", "beneficial"),
        "primary": ("first", "most important"), "specific": ("explicit", "particular"),
        "individual": ("single", "person"), "function": ("purpose", "role"),
        "issue": ("topic", "problem"), "role": ("function", "position"),
        "source": ("origin", "information"), "area": ("region", "field of study"),
        "period": ("length of time", "interval"), "section": ("part", "division"),
        "structure": ("arrangement", "organisation"), "contract": ("agreement",),
    }
    def score(item: dict) -> int:
        definition = item.get("definition", "").lower()
        value = preferred.get(item.get("part_of_speech", ""), 0)
        if expected and item.get("part_of_speech") == expected:
            value += 30
        value += sum(3 for term in positive if term in definition)
        value += sum(25 for term in sense_hints.get(word, ()) if term in definition)
        value -= sum(9 for term in negative if term in definition)
        if definition.startswith("("):
            value -= 18
        value -= sum(12 for term in ("steam engine", "securities", "liturg", "grammar)",
                                      "rugby", "radiology", "feudal", "video game", "social networking",
                                      "web page", "air ticket", "campanology") if term in definition)
        value -= max(0, len(definition) - 240) // 40
        return value
    return max(candidates, key=score) if candidates else {}


def build() -> list[dict]:
    sublists = attached_headwords()
    families = official_families()
    dictionary = json.loads(DICTIONARY.read_text())
    toefl_rows = json.loads(TOEFL.read_text())
    toefl = {row["word"].lower(): row for row in toefl_rows}
    flat_headwords = [word for sublist in sublists for word in sublist]
    records = []
    for index, (headword, family) in enumerate(zip(flat_headwords, families)):
        sublist = index // 60 + 1 if index < 540 else 10
        rank = index % 60 + 1
        # Use enriched material only for the exact displayed form; borrowing a
        # base-form entry can give an inflected headword the wrong part of speech.
        source = toefl.get(headword)
        entry = dictionary.get(headword) or dictionary.get(family[0]) or {}
        meaning = choose_dictionary_meaning(entry, headword)
        if source:
            pos = source.get("pos", "word").lower()
            definition = source.get("definition_en", "")
            example = source.get("example_sentence", "")
        else:
            pos = meaning.get("part_of_speech", "word").lower()
            definition = meaning.get("definition", "A word used across academic disciplines.")
            example = meaning.get("example") or ""
        definition = sentence_case(definition).rstrip(".") + "."
        if (not example or len(example) < 24 or
                not re.search(rf"\b{re.escape(headword)}\b", example, re.I) or
                any(tag in example.lower() for tag in ("archaic", "slang"))):
            example = f'In this report, the term “{headword}” refers to {definition[0].lower() + definition[1:]}'
        example = sentence_case(example).rstrip(".") + "."
        related = [w for w in family if w != headword][:12]
        if headword not in family:
            related = [family[0], *related][:12]
        records.append({
            "id": f"s{sublist}-{rank}", "sublist": sublist, "word": headword,
            "partOfSpeech": pos, "definition": definition, "example": example,
            "family": related, "familyCount": len(family),
        })
    return records


if __name__ == "__main__":
    data = build()
    out = ROOT / "assets" / "awl-data.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    print(f"Wrote {len(data)} records to {out} ({out.stat().st_size:,} bytes)")
    print("TOEFL examples:", sum("term “" not in row["example"] for row in data))
