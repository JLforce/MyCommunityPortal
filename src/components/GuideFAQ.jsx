"use client"

import { useState } from "react";

export default function GuideFAQ({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="guide-faq card">
      <h3 style={{margin:0}}>Frequently asked</h3>
      <p className="muted">Quick answers to common waste-sorting questions</p>
      <div className="faq-list" role="list">
        {faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <button
              className="faq-q"
              aria-expanded={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>{f.q}</span>
              <span className="faq-toggle">{openIndex === i ? "−" : "+"}</span>
            </button>

            <div className={`faq-a ${openIndex === i ? "open" : ""}`} hidden={openIndex !== i}>
              {f.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
