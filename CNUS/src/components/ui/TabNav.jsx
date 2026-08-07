"use client";

import { useCallback } from "react";

export default function TabNav({ tabs, activeTab, onTabChange, activeColor = "bg-[#DCE6F2] text-[#0045A5]" }) {
  const handleKeyDown = useCallback((e) => {
    const currentIdx = tabs.findIndex((t) => t.id === activeTab);
    let nextIdx;
    if (e.key === "ArrowLeft") {
      nextIdx = currentIdx > 0 ? currentIdx - 1 : tabs.length - 1;
    } else if (e.key === "ArrowRight") {
      nextIdx = currentIdx < tabs.length - 1 ? currentIdx + 1 : 0;
    } else {
      return;
    }
    e.preventDefault();
    onTabChange(tabs[nextIdx].id);
  }, [tabs, activeTab, onTabChange]);

  return (
    <section className="w-full max-w-[1680px] mx-auto px-4 tablet:px-[60px] laptop:px-20 mb-[100px] flex flex-col items-center gap-3">
      <div role="tablist" aria-label="Navegación de pestañas" className="flex flex-col items-center gap-3 sm:hidden w-full">
        {tabs.map((tab, i) => (
          <div key={tab.id} className="inline-flex items-center rounded-full border border-[#2b4c7e] p-1.5 bg-white shadow-sm max-w-full">
            <button
              role="tab"
              aria-selected={activeTab === tab.id}
              onKeyDown={handleKeyDown}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition duration-300 ${
                activeTab === tab.id
                  ? activeColor
                  : "bg-transparent text-gray-800 hover:text-[#0045A5]"
              }`}
            >
              {tab.label}
            </button>
            {i < tabs.length - 1 && (
              <>
                {tabs.length === 2 && i === 0 && <div aria-hidden="true" className="w-px h-5 bg-gray-300 shrink-0 mx-1" />}
              </>
            )}
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Navegación de pestañas" className="hidden sm:inline-flex items-center rounded-full border border-[#2b4c7e] p-1.5 bg-white shadow-sm max-w-full overflow-x-auto scrollbar-none">
        {tabs.map((tab, i) => (
          <span key={tab.id} className="inline-flex items-center">
            {i > 0 && <div aria-hidden="true" className="w-px h-6 bg-gray-300 shrink-0 mx-1" />}
            <button
              role="tab"
              aria-selected={activeTab === tab.id}
              onKeyDown={handleKeyDown}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-2.5 rounded-full text-sm tablet:text-base font-semibold whitespace-nowrap transition duration-300 ${
                activeTab === tab.id
                  ? activeColor
                  : "bg-transparent text-gray-800 hover:text-[#0045A5]"
              }`}
            >
              {tab.label}
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}
