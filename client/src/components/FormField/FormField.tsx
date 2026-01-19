import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'url';
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        required={required}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
