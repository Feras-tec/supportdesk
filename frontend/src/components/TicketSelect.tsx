import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Option = {
  value: string;
  label: string;
  badgeClass?: string;
};

type TicketSelectProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

function TicketSelect({ label, value, options, onChange }: TicketSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-field
          border
          border-base-300
          bg-base-100
          px-4
          py-3
          text-left
          transition
          hover:border-primary
          focus:border-primary
          focus:outline-none
        "
      >
        <span
          className={
            selectedOption.badgeClass
              ? `badge ${selectedOption.badgeClass}`
              : ""
          }
        >
          {selectedOption.label}
        </span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="text-sm text-base-content/50"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -5,
              scale: 0.98,
            }}
            transition={{
              duration: 0.15,
            }}
            className="
              absolute
              left-0
              top-full
              z-50
              mt-2
              w-full
              overflow-hidden
              rounded-box
              border
              border-base-300
              bg-base-100
              p-2
              shadow-xl
            "
          >
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option.value)}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-3
                    text-left
                    transition
                    hover:bg-base-200
                    ${active ? "bg-base-200 font-medium" : ""}
                  `}
                >
                  <span
                    className={
                      option.badgeClass ? `badge ${option.badgeClass}` : ""
                    }
                  >
                    {option.label}
                  </span>

                  {active && <span className="text-primary">✓</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TicketSelect;
