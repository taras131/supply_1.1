export type AiSolution = {
    summary: string;
    diagnosis_hypotheses: Array<{ cause: string; likelihood: number; rationale: string }>;
    checks: Array<{ step: string; how_to: string; expected: string; next_if_fail: string }>;
    repair_steps: Array<{ step: string; tools: string[]; parts: string[]; precautions: string }>;
};
function stripCodeFences(s: string): string {
    const m = s.match(/^\s*```(?:json)?\s*([\s\S]*?)\s*```\s*$/i);
    return m ? m[1].trim() : s.trim();
}
function extractFirstJsonObject(input: string): string | null {
    const s = input;
    let start = -1, depth = 0, inString = false, escape = false;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (start === -1) {
            if (ch === "{") { start = i; depth = 1; inString = false; escape = false; }
            continue;
        }
        if (inString) {
            if (escape) { escape = false; }
            else if (ch === "\\") { escape = true; }
            else if (ch === "\"") { inString = false; }
            continue;
        }
        if (ch === "\"") inString = true;
        else if (ch === "{") depth++;
        else if (ch === "}") {
            depth--;
            if (depth === 0) return s.slice(start, i + 1);
        }
    }
    return null;
}
function removeTrailingCommas(jsonLike: string): string {
    return jsonLike.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
}
function coerceAiSolution(v: any): AiSolution {
    const toArray = (x: any): any[] => (Array.isArray(x) ? x : []);
    const toStr = (x: any): string => (typeof x === "string" ? x : "");
    const toNum01 = (x: any): number => {
        const n = typeof x === "number" ? x : Number(x);
        return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
    };
    return {
        summary: toStr(v?.summary),
        diagnosis_hypotheses: toArray(v?.diagnosis_hypotheses).map((d) => ({
            cause: toStr(d?.cause),
            likelihood: toNum01(d?.likelihood),
            rationale: toStr(d?.rationale),
        })),
        checks: toArray(v?.checks).map((c) => ({
            step: toStr(c?.step),
            how_to: toStr(c?.how_to),
            expected: toStr(c?.expected),
            next_if_fail: toStr(c?.next_if_fail),
        })),
        repair_steps: toArray(v?.repair_steps).map((r) => ({
            step: toStr(r?.step),
            tools: toArray(r?.tools).map(toStr),
            parts: toArray(r?.parts).map(toStr),
            precautions: toStr(r?.precautions),
        })),
    };
}
export function parseAiSolution(raw: unknown): AiSolution | null {
    if (raw == null) return null;
    if (typeof raw === "object") return coerceAiSolution(raw as any);
    if (typeof raw !== "string") return null;
    let text = stripCodeFences(raw).trim();
    // Попробуем 2–3 раза распарсить на случай двойной сериализации
    let value: any = text;
    for (let i = 0; i < 3 && typeof value === "string"; i++) {
        try {
            value = JSON.parse(value);
        } catch {
            // Если не получилось — попробуем вытащить первый объект и “починить” хвостовые запятые
            const candidate = extractFirstJsonObject(value);
            if (candidate) {
                try {
                    value = JSON.parse(candidate);
                    break;
                } catch {
                    const repaired = removeTrailingCommas(candidate);
                    value = JSON.parse(repaired); // если упадёт — пусть пробросится
                    break;
                }
            } else {
                break;
            }
        }
    }
    if (value && typeof value === "object") {
        return coerceAiSolution(value);
    }
    // Последняя попытка: если строка выглядит как JSON-объект — распарсим напрямую
    if (typeof value === "string" && /^\s*{/.test(value)) {
        const repaired = removeTrailingCommas(value);
        try {
            return coerceAiSolution(JSON.parse(repaired));
        } catch {
            return null;
        }
    }
    return null;
}