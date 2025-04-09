'use client';

const InputField = ({
  id,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  value,
  onChange,
  onBlur,
  onHelpClick,
  showHelp,
  helpText,
  required = false
}) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`block w-full py-2.5 ${Icon ? 'pl-10' : 'pl-3'} pr-3 border border-gray-300 
                     dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
          placeholder={placeholder}
        />
        {helpText && (
          <button
            type="button"
            onClick={onHelpClick}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 000 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {showHelp && helpText && (
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helpText}</div>
      )}
    </div>
  );
};

export default InputField;