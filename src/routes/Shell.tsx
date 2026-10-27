import { useState } from "react";
import { Outlet, useNavigation, useParams } from "react-router";
import { MenuIcon, XIcon } from "../components/Icons";
import { Sidebar } from "../components/Sidebar";

export function Component() {
  const { challenge } = useParams();
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  // The challenge workbench brings its own left rail.
  if (challenge) {
    return (
      <>
        {navigation.state === "loading" && <LoadingBar />}
        <Outlet />
      </>
    );
  }

  return (
    <div className="min-h-full min-[900px]:pl-[260px]">
      {navigation.state === "loading" && <LoadingBar />}
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] border-r border-border bg-bg min-[900px]:block">
        <Sidebar />
      </aside>

      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/95 px-4 py-3 backdrop-blur min-[900px]:hidden">
        <span className="font-mono text-sm font-bold text-accent">brush up on javascript</span>
        <button
          type="button"
          className="rounded-lg p-1.5 hover:bg-bg-raised"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[53px] z-10 bg-bg min-[900px]:hidden">
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </div>
      )}

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export function LoadingBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden" role="progressbar" aria-label="Loading">
      <div className="h-full w-1/3 animate-pulse bg-accent" />
    </div>
  );
}
