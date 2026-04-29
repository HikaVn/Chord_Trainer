import { useState } from "react";
import { convertChord, parseChords, suggestCapo, formatFingering } from "./chordData";
import "./App.css";

function ChordDiagram({ fingering, chordName }) {
  if (!fingering || fingering === "N/A") return null;
  const frets = fingering.split("").map(Number);
  const maxFret = Math.max(...frets.filter((f) => f > 0));
  const strings = ["G", "C", "E", "A"];
  const rows = Math.max(maxFret, 4);

  return (
    <div className="chord-diagram">
      <div className="chord-diagram-name">{chordName}</div>
      <div className="diagram-wrapper">
        <div className="nut" />
        <div className="fret-grid">
          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} className="fret-row">
              {frets.map((fret, col) => (
                <div key={col} className="fret-cell">
                  <div className="string-line" />
                  {fret === row + 1 && <div className="dot" />}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="open-markers">
          {frets.map((f, i) => (
            <span key={i} className={f === 0 ? "open" : "muted"}>
              {f === 0 ? "○" : ""}
            </span>
          ))}
        </div>
        <div className="string-labels">
          {strings.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
      <div className="fingering-label">{fingering}</div>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [capoSuggestion, setCapoSuggestion] = useState(null);
  const [showDiagrams, setShowDiagrams] = useState(false);

  const handleConvert = () => {
    const chords = parseChords(input);
    if (chords.length === 0) return;

    const converted = chords.map(convertChord).filter(Boolean);
    setResults(converted);

    const validChords = converted.map((r) => r.converted);
    setCapoSuggestion(suggestCapo(validChords));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleConvert();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎸 ウクレレコード変換</h1>
        <p className="subtitle">ギターコード譜をウクレレ用に変換します（標準チューニング G-C-E-A）</p>
      </header>

      <main className="main">
        <section className="input-section">
          <label className="label">ギターコードを入力（スペース・改行区切り）</label>
          <textarea
            className="textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={"例：C G Am F\nまたは\nC G\nAm F\n\nCtrl+Enter で変換"}
            rows={5}
          />
          <div className="button-row">
            <button className="btn-primary" onClick={handleConvert}>
              変換する
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setInput("");
                setResults([]);
                setCapoSuggestion(null);
              }}
            >
              クリア
            </button>
          </div>
        </section>

        {results.length > 0 && (
          <section className="output-section">
            {capoSuggestion && (
              <div className="capo-suggestion">
                <span className="capo-icon">💡</span>
                <strong>カポ提案：</strong> {capoSuggestion.fret} フレット推奨（{capoSuggestion.reason}）
              </div>
            )}

            <div className="table-header-row">
              <h2>変換結果</h2>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showDiagrams}
                  onChange={(e) => setShowDiagrams(e.target.checked)}
                />
                &nbsp;押さえ方図を表示
              </label>
            </div>

            <div className="table-wrapper">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>入力</th>
                    <th>変換後</th>
                    <th>押さえ方</th>
                    <th>G-C-E-A</th>
                    <th>備考</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className={!r.found ? "row-not-found" : ""}>
                      <td className="chord-name">{r.input}</td>
                      <td className="chord-name converted">{r.converted}</td>
                      <td className="fingering mono">{r.fingering}</td>
                      <td className="fingering-fmt mono">{formatFingering(r.fingering)}</td>
                      <td className="notes">
                        {r.isSimplified && <span className="badge badge-simplified">簡略化</span>}
                        {!r.found && <span className="badge badge-missing">未対応</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showDiagrams && (
              <div className="diagrams-section">
                <h3>押さえ方図</h3>
                <div className="diagrams-grid">
                  {results
                    .filter((r) => r.found)
                    .map((r, i) => (
                      <ChordDiagram key={i} fingering={r.fingering} chordName={r.converted} />
                    ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="reference-section">
          <details>
            <summary>対応コード・変換ルール一覧</summary>
            <div className="reference-content">
              <div className="ref-group">
                <h4>メジャー</h4>
                <p>C, D, E, F, G, A, B（#・b含む）</p>
              </div>
              <div className="ref-group">
                <h4>マイナー (m)</h4>
                <p>Am, Bm, Cm, Dm, Em, Fm, Gm（#・b含む）</p>
              </div>
              <div className="ref-group">
                <h4>7th / m7</h4>
                <p>C7, D7 ... / Am7, Bm7 ...</p>
              </div>
              <div className="ref-group">
                <h4>dim / aug / sus4</h4>
                <p>Cdim, Caug, Csus4 など</p>
              </div>
              <div className="ref-group">
                <h4>簡略変換ルール</h4>
                <table className="mini-table">
                  <thead>
                    <tr>
                      <th>元コード</th>
                      <th>変換後</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>B</td>
                      <td>B7</td>
                    </tr>
                    <tr>
                      <td>F#m</td>
                      <td>F#m7</td>
                    </tr>
                    <tr>
                      <td>Cdim</td>
                      <td>C7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        </section>
      </main>

      <footer className="footer">
        <p>標準チューニング: G-C-E-A ｜ 数字は各弦のフレット番号（0=開放弦）</p>
        <p>
          <a
            href="https://hikavn.github.io/Chord_Trainer/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://hikavn.github.io/Chord_Trainer/
          </a>
        </p>
      </footer>
    </div>
  );
}
