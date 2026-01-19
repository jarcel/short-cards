import { useState } from 'react';
import type { ContactInfo } from '@short-cards/shared';
import { FormField } from '../FormField';
import { AddressFields, type AddressData } from '../AddressFields';
import styles from './CardForm.module.css';

interface CardFormProps {
  onSubmit: (contact: ContactInfo) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
}

const initialAddress = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const initialFormData: ContactInfo = {
  firstName: '',
  lastName: '',
  middleName: '',
  prefix: '',
  suffix: '',
  email: '',
  phone: '',
  cellPhone: '',
  workPhone: '',
  organization: '',
  title: '',
  website: '',
  notes: '',
  address: initialAddress,
};

export function CardForm({ onSubmit, isSubmitting, error }: CardFormProps) {
  const [formData, setFormData] = useState<ContactInfo>(initialFormData);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (address: AddressData) => {
    setFormData((prev) => ({ ...prev, address }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Name</h3>
        <div className={styles.grid}>
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleFieldChange}
            required
            placeholder="John"
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleFieldChange}
            required
            placeholder="Doe"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact</h3>
        <div className={styles.fields}>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleFieldChange}
            placeholder="john@example.com"
          />
          <FormField
            label="Cell Phone"
            name="cellPhone"
            type="tel"
            value={formData.cellPhone || ''}
            onChange={handleFieldChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Work</h3>
        <div className={styles.fields}>
          <div className={styles.grid}>
            <FormField
              label="Organization"
              name="organization"
              value={formData.organization || ''}
              onChange={handleFieldChange}
              placeholder="Acme Corp"
            />
            <FormField
              label="Title"
              name="title"
              value={formData.title || ''}
              onChange={handleFieldChange}
              placeholder="Software Engineer"
            />
          </div>
          <FormField
            label="Website"
            name="website"
            type="url"
            value={formData.website || ''}
            onChange={handleFieldChange}
            placeholder="https://example.com"
          />
        </div>
      </section>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={styles.toggleButton}
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced Fields
        <span className={`${styles.chevron} ${showAdvanced ? styles.chevronUp : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {showAdvanced && (
        <div className={styles.advancedFields}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Name Details</h3>
            <div className={styles.grid}>
              <FormField
                label="Prefix"
                name="prefix"
                value={formData.prefix || ''}
                onChange={handleFieldChange}
                placeholder="Dr."
              />
              <FormField
                label="Middle Name"
                name="middleName"
                value={formData.middleName || ''}
                onChange={handleFieldChange}
                placeholder="William"
              />
              <FormField
                label="Suffix"
                name="suffix"
                value={formData.suffix || ''}
                onChange={handleFieldChange}
                placeholder="Jr."
              />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Additional Phones</h3>
            <div className={styles.grid}>
              <FormField
                label="Home Phone"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={handleFieldChange}
                placeholder="+1 (555) 123-4567"
              />
              <FormField
                label="Work Phone"
                name="workPhone"
                type="tel"
                value={formData.workPhone || ''}
                onChange={handleFieldChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </section>

          <section className={styles.section}>
            <AddressFields
              address={formData.address || initialAddress}
              onChange={handleAddressChange}
            />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Notes</h3>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              className={styles.textarea}
              placeholder="Additional notes..."
              rows={3}
            />
          </section>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'Creating...' : 'Create vCard'}
      </button>
    </form>
  );
}
