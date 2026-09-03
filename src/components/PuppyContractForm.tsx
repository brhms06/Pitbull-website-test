'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from './FormField';
import Modal from './Modal';
import SignaturePad from './SignaturePad';
import { notify } from '@/lib/notify';
import { submitPuppyContract } from '@/lib/db';

const PAYMENT_METHODS = ['Zelle', 'Cash App', 'Chime', 'Apple Pay'];

interface ContractData {
  dogId: string;
  dogName: string;
  buyerName: string;
  email: string;
  phone: string;
  address: string;
  shippingOption: string;
  paymentMethod: string;
  price: string;
  agree: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{6,}$/;

interface Props {
  dogs: { id: string; name: string; price: number }[];
}

export default function PuppyContractForm({ dogs }: Props) {
  const router = useRouter();
  const [data, setData] = useState<ContractData>({
    dogId: '',
    dogName: '',
    buyerName: '',
    email: '',
    phone: '',
    address: '',
    shippingOption: '',
    paymentMethod: '',
    price: '',
    agree: '',
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ContractData | 'signature', string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof ContractData, value: string | boolean) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const chooseDog = (id: string) => {
    const chosen = dogs.find((d) => d.id === id);
    setData((d) => ({ ...d, dogId: id, dogName: chosen?.name ?? '', price: chosen ? String(chosen.price) : d.price }));
    setErrors((e) => ({ ...e, dogId: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (dogs.length > 0 && !data.dogId) next.dogId = 'Please choose a puppy.';
    if (!data.buyerName.trim()) next.buyerName = 'Please enter your name.';
    if (!data.email.trim()) next.email = 'An email is required.';
    else if (!emailPattern.test(data.email)) next.email = 'Enter a valid email.';
    if (!data.phone.trim()) next.phone = 'A phone number is required.';
    else if (!phonePattern.test(data.phone)) next.phone = 'Enter a valid phone number.';
    if (!data.address.trim()) next.address = 'Please add your delivery/pick-up address.';
    if (!data.shippingOption) next.shippingOption = 'Please choose delivery or pick up.';
    if (!data.paymentMethod) next.paymentMethod = 'Please choose a payment method.';
    if (!signature) next.signature = 'Please sign above before submitting.';
    if (!data.agree) next.agree = 'Please choose Yes or No.';
    else if (data.agree === 'No') next.agree = 'You must accept the terms to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !signature) return;
    setSubmitting(true);
    const price = Number(data.price) || 0;
    await Promise.all([
      notify({
        type: 'contract',
        buyerName: data.buyerName,
        email: data.email,
        phone: data.phone,
        dogName: data.dogName,
        address: data.address,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        price,
        signature,
      }),
      submitPuppyContract({
        dogId: data.dogId,
        dogName: data.dogName,
        buyerName: data.buyerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        price,
        signature,
      }).catch(() => {}),
    ]);
    setSubmitting(false);
    setSuccess(true);
  };

  const inputCls = (field: keyof ContractData) => `input ${errors[field] ? 'input-error' : ''}`;

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {dogs.length > 0 && (
            <FormField label="Puppy of interest" htmlFor="c-dog" required error={errors.dogId} className="sm:col-span-2">
              <select id="c-dog" className={inputCls('dogId')} value={data.dogId} onChange={(e) => chooseDog(e.target.value)}>
                <option value="">Select a puppy…</option>
                {dogs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </FormField>
          )}
          <FormField label="Full name" htmlFor="c-name" required error={errors.buyerName}>
            <input id="c-name" className={inputCls('buyerName')} value={data.buyerName} onChange={(e) => update('buyerName', e.target.value)} autoComplete="name" />
          </FormField>
          <FormField label="Email" htmlFor="c-email" required error={errors.email}>
            <input id="c-email" type="email" className={inputCls('email')} value={data.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" />
          </FormField>
          <FormField label="Phone" htmlFor="c-phone" required error={errors.phone}>
            <input id="c-phone" type="tel" className={inputCls('phone')} value={data.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" />
          </FormField>
          <FormField label="Agreed price ($)" htmlFor="c-price" hint="Optional">
            <input id="c-price" type="number" min="0" className="input" value={data.price} onChange={(e) => update('price', e.target.value)} />
          </FormField>
          <FormField label="Delivery address" htmlFor="c-address" required error={errors.address} className="sm:col-span-2">
            <input id="c-address" className={inputCls('address')} value={data.address} onChange={(e) => update('address', e.target.value)} placeholder="Street, city, state, ZIP" />
          </FormField>

          <FormField label="Shipping option" htmlFor="c-shipping" required error={errors.shippingOption}>
            <div className="flex flex-col gap-2 pt-1">
              {['Ground Transport', 'Flight Nanny', 'Local or Airport Pickup'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-ink/85">
                  <input type="radio" name="shippingOption" checked={data.shippingOption === opt} onChange={() => update('shippingOption', opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Payment method" htmlFor="c-payment" required error={errors.paymentMethod}>
            <div className="flex flex-col gap-2 pt-1">
              {PAYMENT_METHODS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-ink/85">
                  <input type="radio" name="paymentMethod" checked={data.paymentMethod === opt} onChange={() => update('paymentMethod', opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </FormField>
        </div>

        <div className="mt-6">
          <label className="label">
            Your signature <span className="text-ember">*</span>
          </label>
          <SignaturePad onChange={setSignature} error={errors.signature} />
        </div>

        <div className="mt-5">
          <FormField label="Accept Terms & Conditions?" htmlFor="c-agree" required error={errors.agree} hint="Your signature above confirms this agreement.">
            <div className="flex gap-4 pt-1">
              {['Yes', 'No'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm text-ink/85">
                  <input type="radio" name="agree" checked={data.agree === opt} onChange={() => update('agree', opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </FormField>
        </div>

        <button type="submit" disabled={submitting} className="btn-accent mt-6 w-full disabled:opacity-70">
          {submitting ? 'Submitting…' : 'Sign & Submit Contract'}
        </button>
      </form>

      <Modal open={success} onClose={() => router.push('/')} title="Contract received!">
        Thanks — your signed contract has been sent to us and we&apos;ll be in touch shortly to confirm next steps.
      </Modal>
    </>
  );
}
