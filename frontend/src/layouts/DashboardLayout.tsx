import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

type Theme = "light" | "dark";

function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("supportdesk-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "light";
  });

  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("supportdesk-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 font-medium transition-all ${
      isActive ? "bg-primary text-primary-content shadow" : "hover:bg-base-200"
    }`;

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      {/* =========================
          Mobile Header
      ========================== */}

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-base-300 bg-base-100 px-4 shadow-sm lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="btn btn-square btn-ghost"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">SupportDesk</h1>

            <p className="truncate text-xs text-base-content/50">
              Support Management
            </p>
          </div>
        </div>

        {/* Mobile Theme Button */}

        <motion.button
          whileTap={{
            scale: 0.9,
            rotate: 15,
          }}
          type="button"
          className="btn btn-circle btn-ghost"
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          title={theme === "light" ? "Dark Mode" : "Light Mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{
                opacity: 0,
                rotate: -90,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: 90,
                scale: 0.5,
              }}
              transition={{
                duration: 0.2,
              }}
              className="text-xl"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </header>

      {/* =========================
          Desktop Sidebar
      ========================== */}

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-base-300 bg-base-100 lg:flex lg:flex-col">
        <div className="border-b border-base-300 p-6">
          <h1 className="text-2xl font-bold">SupportDesk</h1>

          <p className="mt-1 text-sm text-base-content/50">
            Support Management
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <NavLink to="/" end className={navItemClass}>
            Dashboard
          </NavLink>

          <NavLink to="/tickets" className={navItemClass}>
            Tickets
          </NavLink>

          <NavLink to="/users" className={navItemClass}>
            Users
          </NavLink>
        </nav>

        {/* Desktop Theme */}

        <div className="border-t border-base-300 p-4">
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost w-full justify-start gap-3"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{
                  opacity: 0,
                  rotate: -90,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  rotate: 90,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="text-lg"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </motion.span>
            </AnimatePresence>

            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </motion.button>

          <p className="mt-3 px-4 text-xs text-base-content/40">SupportDesk</p>
        </div>
      </aside>

      {/* =========================
          Mobile Sidebar
      ========================== */}

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark Background */}

            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />

            {/* Sidebar */}

            <motion.aside
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="
                fixed
                inset-y-0
                left-0
                z-50
                flex
                w-70
                max-w-[82vw]
                flex-col
                bg-base-100
                shadow-2xl
                lg:hidden
              "
            >
              <div className="flex items-center justify-between border-b border-base-300 p-5">
                <div>
                  <h2 className="text-xl font-bold">SupportDesk</h2>

                  <p className="text-xs text-base-content/50">Menu</p>
                </div>

                <button
                  type="button"
                  className="btn btn-circle btn-ghost btn-sm"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 space-y-2 p-4">
                <NavLink
                  to="/"
                  end
                  onClick={closeMenu}
                  className={navItemClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/tickets"
                  onClick={closeMenu}
                  className={navItemClass}
                >
                  Tickets
                </NavLink>

                <NavLink
                  to="/users"
                  onClick={closeMenu}
                  className={navItemClass}
                >
                  Users
                </NavLink>
              </nav>

              {/* Mobile Sidebar Theme */}

              <div className="border-t border-base-300 p-4">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="btn btn-ghost w-full justify-start gap-3"
                >
                  <span className="text-lg">
                    {theme === "light" ? "🌙" : "☀️"}
                  </span>

                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* =========================
          Page Content
      ========================== */}

      <main className="min-h-screen lg:ml-64">
        <div
          key={location.pathname}
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            py-5
            sm:px-6
            sm:py-6
            lg:px-8
            lg:py-8
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
