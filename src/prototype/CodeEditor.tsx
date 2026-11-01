import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { sql } from '@codemirror/lang-sql'

// The code box on the task screen (S10): colours, line numbers, brackets and autocomplete, like an IDE.
// It suggests words of the language and, for SQL, the task's tables and columns. It never suggests a solution.
// Keyboard: Tab indents; Esc, then Tab, leaves the box, so keyboard users are not trapped.
// When suggestions are open, the first Esc closes them and the second lets Tab leave.
export type Language = 'sql' | 'javascript' | 'java' | 'python'

const languages = {
  // The first table is the default one, so its columns are suggested without "orders." in front.
  sql: (tables?: Record<string, string[]>) =>
    sql({ schema: tables, defaultTable: tables && Object.keys(tables)[0], upperCaseKeywords: true }),
  javascript: () => javascript(),
  java: () => java(),
  python: () => python(),
}

type Props = {
  value: string
  onChange: (value: string) => void
  language: Language
  tables?: Record<string, string[]>
  labelledBy: string
  describedBy: string
}

export default function CodeEditor({ value, onChange, language, tables, labelledBy, describedBy }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const changed = useRef(onChange)
  changed.current = onChange

  // The editor keeps its own text; it is created once per task, so value is only the starting text.
  useEffect(() => {
    const view = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          indentUnit.of('    '),
          languages[language](tables),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ 'aria-labelledby': labelledBy, 'aria-describedby': describedBy }),
          EditorView.updateListener.of((u) => u.docChanged && changed.current(u.state.doc.toString())),
        ],
      }),
    })
    return () => view.destroy()
  }, [language])

  return <div ref={host} className="code-editor" />
}
