"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ items }: { items: TabItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const active = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <div>
      <div role="tablist" className="mb-6 flex gap-2 border-b border-border">
        {items.map((item) => {
          const isActive = item.id === active?.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(item.id)}
              className={`text-button px-4 py-3 -mb-px border-b-2 transition-colors ${
                isActive ? "border-accent text-accent" : "border-transparent text-fg-secondary hover:text-fg"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {active?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
