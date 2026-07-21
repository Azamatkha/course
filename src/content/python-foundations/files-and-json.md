## Learning objectives

- Read and write files safely with `pathlib` and `with`.
- Handle **text encodings** correctly (and why UTF-8 is the default answer).
- Serialize/deserialize with the **`json`** module and round-trip data safely.
- Stream large files without loading them into memory.

## Prerequisites

[Context Managers](/courses/python-foundations/context-managers) and [Error Handling](/courses/python-foundations/error-handling).

## The core idea in one line

> Files are streams of **bytes**; text mode adds an **encoding** to turn bytes into `str`. JSON is the universal text format for exchanging structured data.

**Analogy — shipping goods.** Your Python objects are furniture in a room. To ship them (save/send), you flat-pack into a standard box (serialize to JSON text), and to receive you unpack (deserialize). Encoding is the language on the shipping label — if the sender writes it in UTF-8 and the receiver reads it as something else, the label turns to garbage (mojibake). Agree on UTF-8 and everything arrives intact.

## Reading and writing with pathlib

`pathlib.Path` is the modern, cross-platform way to handle paths:

```python
from pathlib import Path

p = Path("data") / "notes.txt"     # OS-correct path joining
p.parent.mkdir(parents=True, exist_ok=True)

p.write_text("hello\n", encoding="utf-8")     # simple whole-file write
content = p.read_text(encoding="utf-8")        # simple whole-file read
p.exists(), p.suffix, p.stem                   # rich path API
```

For streaming or appending, use `open` with `with`:

```python
with open(p, "a", encoding="utf-8") as f:      # 'a' = append
    f.write("another line\n")

with open(p, encoding="utf-8") as f:
    for line in f:                              # iterate lines lazily — flat memory
        process(line.rstrip("\n"))
```

## File modes

| Mode | Meaning |
|---|---|
| `"r"` | Read (default), file must exist |
| `"w"` | Write, **truncates** existing content |
| `"a"` | Append to end |
| `"x"` | Create, fail if exists |
| `"b"` | Binary (bytes, no encoding) — e.g. `"rb"` |

> [!WARNING]
> `"w"` erases the file immediately on open. Use `"a"` to add, or `"x"` to avoid clobbering. Always pass `encoding="utf-8"` for text — the OS default varies and causes "works on my machine" bugs.

## Encodings, briefly

- Text files store **bytes**; an encoding maps characters ↔ bytes.
- **UTF-8** encodes every Unicode character and is the web/interop standard — make it your explicit default.
- Reading with the wrong encoding raises `UnicodeDecodeError` or produces garbage. When in doubt, specify `encoding="utf-8"`.

## JSON

```python
import json

data = {"name": "Ada", "langs": ["python", "sql"], "active": True}

text = json.dumps(data, indent=2, ensure_ascii=False)   # object → JSON string
back = json.loads(text)                                   # JSON string → object

with open("out.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)      # write to file
with open("out.json", encoding="utf-8") as f:
    obj = json.load(f)                                     # read from file
```

Type mapping (Python ↔ JSON):

| Python | JSON |
|---|---|
| `dict` | object |
| `list`/`tuple` | array |
| `str` | string |
| `int`/`float` | number |
| `True`/`False` | true/false |
| `None` | null |

Note: tuples become arrays (you get a list back), and dict keys become strings. Non-JSON types (`datetime`, `set`, custom objects) need a custom encoder:

```python
from datetime import datetime
def default(o):
    if isinstance(o, datetime):
        return o.isoformat()
    raise TypeError(type(o))
json.dumps({"when": datetime.now()}, default=default)
```

## Streaming large data

Don't `json.load` a 5 GB file. For large newline-delimited JSON (JSONL), process line by line:

```python
with open("events.jsonl", encoding="utf-8") as f:
    for line in f:                     # one record at a time
        event = json.loads(line)
        handle(event)                  # flat memory regardless of file size
```

## Common mistakes

1. **Forgetting `encoding="utf-8"`** — platform-dependent bugs.
2. **Opening `"w"` when you meant `"a"`** — silently wipes the file.
3. **Not using `with`** — leaked file handles.
4. **`json.load`-ing a huge file** — memory blowup; stream JSONL instead.
5. **Assuming tuples/sets survive JSON** — they don't; you get lists / a `TypeError`.

## Performance & memory

- Iterating a file object yields lines lazily — O(1) memory for line processing.
- `pathlib` is convenient but `open` streaming is better for very large files.
- JSON parsing is CPU-bound; for huge/hot workloads consider `orjson` (faster) — but stdlib `json` is fine for most cases.

## Interview questions

1. **"Why always specify UTF-8?"** — The OS default encoding varies; being explicit prevents cross-platform decode bugs.
2. **"Difference between `w` and `a`?"** — `w` truncates, `a` appends; `x` fails if the file exists.
3. **"How do you process a huge JSONL file?"** — Iterate the file line by line and `json.loads` each record — flat memory.
4. **"What JSON limitation surprises people?"** — Tuples become arrays (lists back), keys become strings, and `datetime`/`set` aren't serializable without a custom encoder.

## Summary

- Use `pathlib` for paths and `with` for guaranteed closing.
- Always pass `encoding="utf-8"` for text; know the file modes.
- `json.dump/load` round-trips data with a known type mapping; custom types need an encoder.
- Stream large files line by line to keep memory flat.

## Exercises

**Easy**

1. Write a dict to `config.json` and read it back; confirm equality.
2. Append three lines to a log file with `"a"` mode and UTF-8, then read them.

**Intermediate**

3. Write a function that safely loads JSON, returning a default on `FileNotFoundError` or `JSONDecodeError`.
4. Serialize an object containing a `datetime` using a custom `default` encoder, and parse it back.

**Advanced**

5. Process a 1M-line JSONL file to compute a per-category count with flat memory; time it.

**Debugging**

6. A teammate's script wipes their data file every run. Given they use `open(path, "w")` at the top, explain and fix it.

**Mini project**

Build a `store.py`: a tiny JSON-backed key-value store with `get`, `set`, `delete`, atomic writes (write to a temp file then rename), and UTF-8 everywhere. Add tests including a corrupted-file recovery path.

## Quiz

<details>
<summary>1. What does `open(path, "w")` do to existing content?</summary>
Truncates it — the file is emptied on open. Use `"a"` to append or `"x"` to avoid clobbering.
</details>

<details>
<summary>2. Why pass `encoding="utf-8"` explicitly?</summary>
The platform default varies; explicit UTF-8 avoids cross-platform decode/garbled-text bugs.
</details>

<details>
<summary>3. What happens to a tuple through JSON?</summary>
It's serialized as an array and comes back as a list — tuples aren't preserved.
</details>

<details>
<summary>4. How do you keep memory flat reading a huge file?</summary>
Iterate the file object line by line instead of loading it all at once.
</details>

## Further reading

- Python docs: `pathlib`, `json`, "Reading and Writing Files"
- Next lesson: [Dataclasses, Enums & Typing](/courses/python-foundations/dataclasses-enums-typing)
