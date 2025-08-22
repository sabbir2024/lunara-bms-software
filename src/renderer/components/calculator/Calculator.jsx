// Calculator.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FcCalculator } from "react-icons/fc";

/** ---- tiny expression evaluator ( + - * / with precedence ) ---- */
function evaluateExpression(expr) {
    // sanitize: only digits, operators, dot, parentheses, spaces
    if (!/^[\d+\-*/().\s]+$/.test(expr)) throw new Error("Invalid input");

    // tokenize
    const tokens = [];
    const s = expr.replace(/\s+/g, "");
    let i = 0;
    while (i < s.length) {
        const ch = s[i];

        // number (with decimals)
        if (/\d|\./.test(ch)) {
            let j = i + 1;
            while (j < s.length && /[\d.]/.test(s[j])) j++;
            const numStr = s.slice(i, j);
            if (!/^(\d+(\.\d*)?|\.\d+)$/.test(numStr)) throw new Error("Bad number");
            tokens.push({ t: "num", v: parseFloat(numStr) });
            i = j;
            continue;
        }

        // operator or parentheses
        if ("+-*/()".includes(ch)) {
            tokens.push({ t: "op", v: ch });
            i++;
            continue;
        }

        throw new Error("Unexpected char");
    }

    // shunting-yard to RPN
    const out = [];
    const ops = [];
    const prec = { "+": 1, "-": 1, "*": 2, "/": 2 };

    for (let k = 0; k < tokens.length; k++) {
        const tok = tokens[k];

        if (tok.t === "num") {
            out.push(tok);
        } else if (tok.v === "(") {
            ops.push(tok);
        } else if (tok.v === ")") {
            while (ops.length && ops[ops.length - 1].v !== "(") out.push(ops.pop());
            if (!ops.length) throw new Error("Mismatched )");
            ops.pop(); // pop "("
        } else {
            // handle unary minus: convert "-x" to (0 - x) when needed
            if (
                tok.v === "-" &&
                (k === 0 ||
                    (tokens[k - 1].t === "op" && tokens[k - 1].v !== ")"))
            ) {
                out.push({ t: "num", v: 0 });
            }
            while (
                ops.length &&
                ops[ops.length - 1].t === "op" &&
                ops[ops.length - 1].v in prec &&
                prec[ops[ops.length - 1].v] >= prec[tok.v]
            ) {
                out.push(ops.pop());
            }
            ops.push(tok);
        }
    }
    while (ops.length) {
        const top = ops.pop();
        if (top.v === "(") throw new Error("Mismatched (");
        out.push(top);
    }

    // evaluate RPN
    const st = [];
    for (const t of out) {
        if (t.t === "num") st.push(t.v);
        else {
            const b = st.pop();
            const a = st.pop();
            if (a === undefined || b === undefined) throw new Error("Bad expr");
            let r;
            switch (t.v) {
                case "+": r = a + b; break;
                case "-": r = a - b; break;
                case "*": r = a * b; break;
                case "/": r = b === 0 ? NaN : a / b; break;
                default: throw new Error("Bad op");
            }
            st.push(r);
        }
    }
    if (st.length !== 1) throw new Error("Bad expr");
    return st[0];
}

/** -------------------- UI Component -------------------- */
export default function Calculator() {
    const [input, setInput] = useState("");
    const [ans, setAns] = useState(null);
    const [error, setError] = useState("");
    const containerRef = useRef(null);

    const display = useMemo(
        () => (input.trim().length ? input : ans ?? "0"),
        [input, ans]
    );

    const append = (v) => setInput((s) => (s === "0" ? String(v) : s + v));
    const clear = () => { setInput(""); setError(""); };
    const allClear = () => { setInput(""); setAns(null); setError(""); };
    const backspace = () => setInput((s) => s.slice(0, -1));

    const plusMinus = () => {
        // toggle sign of the last number segment
        setInput((s) => {
            const m = s.match(/(.*?)(\d*\.?\d+)\s*$/);
            if (!m) return s.length ? `-${s}` : s;
            const head = m[1];
            const num = m[2];
            const signed = num.startsWith("-") ? num.slice(1) : `-${num}`;
            return head + signed;
        });
    };

    const percent = () => {
        // convert last number to % of 100 (x -> x/100)
        setInput((s) => {
            const m = s.match(/(.*?)(\d*\.?\d+)\s*$/);
            if (!m) return s;
            const head = m[1];
            const num = parseFloat(m[2]);
            if (isNaN(num)) return s;
            return head + String(num / 100);
        });
    };

    const calculate = () => {
        try {
            const result = evaluateExpression(input || String(ans ?? "0"));
            setAns(result);
            setInput("");
            setError("");
        } catch (error) {
            setError("Syntax error");
        }
    };

    // keyboard support
    useEffect(() => {
        const onKey = (e) => {
            const k = e.key;
            if (/\d/.test(k)) append(k);
            else if ("+-*/().".includes(k)) append(k);
            else if (k === "Enter" || k === "=") { e.preventDefault(); calculate(); }
            else if (k === "Backspace") backspace();
            else if (k.toLowerCase() === "c" && (e.ctrlKey || e.metaKey)) allClear();
            else if (k.toLowerCase() === "c") clear();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Btn = ({ children, onClick, className = "" }) => (
        <button
            onClick={onClick}
            className={
                "h-12 rounded-2xl shadow px-3 text-lg font-medium active:scale-95 transition " +
                "bg-white border " + className
            }
        >
            {children}
        </button>
    );

    return (
        <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button className="" onClick={() => document.getElementById('my_modal_7').showModal()}><FcCalculator /></button>
            <dialog id="my_modal_7" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div
                        ref={containerRef}
                        className="max-w-sm w-full mx-auto p-4 rounded-2xl border bg-gray-50 shadow-sm"
                    >
                        <div className="mb-2 text-right text-sm text-gray-500 min-h-5">
                            {error ? <span className="text-red-500">{error}</span> : " "}
                        </div>
                        <div className="mb-4 p-3 bg-white rounded-xl border text-right text-3xl font-semibold break-words min-h-[60px]">
                            {String(display)}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <Btn onClick={allClear} className="bg-gray-100 hover:bg-info">AC</Btn>
                            <Btn onClick={clear} className="bg-gray-100 hover:bg-info">C</Btn>
                            <Btn onClick={backspace} className="col-span-2 bg-gray-100 hover:bg-info">⌫</Btn>
                            <Btn onClick={() => append("(")} className="bg-gray-100 hover:bg-info">(</Btn>
                            <Btn onClick={() => append(")")} className="bg-gray-100 hover:bg-info">)</Btn>
                            <Btn onClick={plusMinus} className="bg-gray-100 hover:bg-info">±</Btn>
                            <Btn onClick={percent} className="bg-gray-100 hover:bg-info">%</Btn>


                            <Btn onClick={() => append("7")} className="hover:bg-info">7</Btn>
                            <Btn onClick={() => append("8")} className="hover:bg-info">8</Btn>
                            <Btn onClick={() => append("9")} className="hover:bg-info">9</Btn>

                            <Btn onClick={() => append("/")} className="bg-gray-100 hover:bg-info">÷</Btn>

                            <Btn onClick={() => append("4")} className="hover:bg-info">4</Btn>
                            <Btn onClick={() => append("5")} className="hover:bg-info">5</Btn>
                            <Btn onClick={() => append("6")} className="hover:bg-info">6</Btn>
                            <Btn onClick={() => append("*")} className="bg-gray-100 hover:bg-info">×</Btn>
                            <Btn onClick={() => append("1")} className="hover:bg-info">1</Btn>
                            <Btn onClick={() => append("2")} className="hover:bg-info">2</Btn>
                            <Btn onClick={() => append("3")} className="hover:bg-info">3</Btn>
                            <Btn onClick={() => append("+")} className="bg-gray-100 hover:bg-info">+</Btn>
                            <Btn onClick={() => append("0")} className="col-span-2 hover:bg-info">0</Btn>
                            <Btn onClick={() => append(".")} className="hover:bg-info">.</Btn>
                            <Btn onClick={() => append("-")} className="bg-gray-100 hover:bg-info">−</Btn>




                            <Btn onClick={calculate} className="col-span-4 bg-blue-600  text-black">
                                =
                            </Btn>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>

    );
}
