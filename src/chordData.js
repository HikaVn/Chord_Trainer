// ウクレレコード辞書 (GCEA チューニング)
// フォーマット: [G弦, C弦, E弦, A弦]
export const CHORD_DICT = {
  // メジャーコード
  C: "0003",
  D: "2220",
  E: "4442",
  F: "2010",
  G: "0232",
  A: "2100",
  B: "4322",

  "C#": "1114",
  "Db": "1114",
  "D#": "3331",
  "Eb": "3331",
  "F#": "3121",
  "Gb": "3121",
  "G#": "5343",
  "Ab": "5343",
  "A#": "0333",
  "Bb": "0333",

  // マイナーコード
  Am: "2000",
  Bm: "4222",
  Cm: "0333",
  Dm: "2210",
  Em: "0432",
  Fm: "1013",
  Gm: "0231",

  "C#m": "1104",
  "Dbm": "1104",
  "D#m": "3321",
  "Ebm": "3321",
  "F#m": "2120",
  "Gbm": "2120",
  "G#m": "4342",
  "Abm": "4342",
  "A#m": "0320",
  "Bbm": "0320",

  // 7thコード
  C7: "0001",
  D7: "2020",
  E7: "1202",
  F7: "2313",
  G7: "0212",
  A7: "0100",
  B7: "2322",

  "C#7": "1112",
  "Db7": "1112",
  "D#7": "3231",
  "Eb7": "3231",
  "F#7": "1312",
  "Gb7": "1312",
  "G#7": "1213",
  "Ab7": "1213",
  "A#7": "0131",
  "Bb7": "0131",

  // マイナー7th
  Am7: "0000",
  Bm7: "2222",
  Cm7: "0333",
  Dm7: "2213",
  Em7: "0202",
  Fm7: "1313",
  Gm7: "0211",

  "C#m7": "1104",
  "Dbm7": "1104",
  "D#m7": "3321",
  "Ebm7": "3321",
  "F#m7": "2120",
  "Gbm7": "2120",
  "G#m7": "4342",
  "Abm7": "4342",
  "A#m7": "0320",
  "Bbm7": "0320",

  // dim
  Cdim: "2323",
  Ddim: "1212",
  Edim: "0101",
  Fdim: "1212",
  Gdim: "0101",
  Adim: "2323",
  Bdim: "1212",

  "C#dim": "0101",
  "Dbdim": "0101",
  "D#dim": "2323",
  "Ebdim": "2323",
  "F#dim": "0101",
  "Gbdim": "0101",
  "G#dim": "2323",
  "Abdim": "2323",
  "A#dim": "0101",
  "Bbdim": "0101",

  // aug
  Caug: "1003",
  Daug: "2221",
  Eaug: "1003",
  Faug: "2114",
  Gaug: "0332",
  Aaug: "2110",
  Baug: "0443",

  // sus4
  Csus4: "0013",
  Dsus4: "0230",
  Esus4: "4445",
  Fsus4: "0013",
  Gsus4: "0233",
  Asus4: "2200",
  Bsus4: "4420",
};

// 簡略コード変換マップ
export const SIMPLIFIED_MAP = {
  B: "B7",
  "F#m": "F#m7",
  Cdim: "C7",
};

// キーと難しさの評価
const HARD_CHORDS = ["B", "F#", "C#", "G#", "D#", "A#", "Gb", "Db", "Eb", "Ab", "Bb"];

// カポ提案ロジック
export function suggestCapo(chords) {
  const hardCount = chords.filter((c) => {
    const root = c.replace(/m7?|7|dim|aug|sus4/, "");
    return HARD_CHORDS.includes(root);
  }).length;

  if (hardCount === 0) return null;

  // キー判定（最初のコードのルートをキーとして使用）
  const firstRoot = chords[0]?.replace(/m7?|7|dim|aug|sus4/, "") || "";
  const capoMap = {
    B: 2,
    "F#": 4,
    "C#": 1,
    "G#": 1,
    "D#": 3,
    "A#": 3,
    Gb: 4,
    Db: 1,
    Eb: 3,
    Ab: 1,
    Bb: 3,
  };

  const capoFret = capoMap[firstRoot];
  if (capoFret) {
    return { fret: capoFret, reason: `キー ${firstRoot} のため` };
  }
  return null;
}

// コード変換メイン関数
export function convertChord(inputChord) {
  const trimmed = inputChord.trim();
  if (!trimmed) return null;

  // 簡略コード変換
  const simplified = SIMPLIFIED_MAP[trimmed];
  const targetChord = simplified || trimmed;

  // 辞書から取得
  const fingering = CHORD_DICT[targetChord];

  return {
    input: trimmed,
    converted: targetChord,
    fingering: fingering || "N/A",
    isSimplified: !!simplified,
    found: !!fingering,
  };
}

// テキストからコードを抽出
export function parseChords(text) {
  // 空白・改行区切りでコードを分割
  const tokens = text
    .split(/[\s\n]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  return tokens;
}

// タブ表示をフォーマット
export function formatFingering(fingering) {
  if (!fingering || fingering === "N/A") return "N/A";
  return fingering.split("").join("-");
}
