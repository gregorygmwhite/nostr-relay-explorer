'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import urls from '@/config/urls';

const RelayForm: React.FC = () => {
  const router = useRouter();
  const [url, setUrl] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const res = await fetch(urls.apis.relays, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, name }),
    });

    if (res.status === 200) {
      router.push(urls.pages.relays);
    } else {
      alert('Failed to create relay');
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
        <div className="mt-4">
            <h1 className="text-3xl font-bold mb-4">Create Relay</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
                    URL
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    >
                    Submit
                </button>
            </div>
            </form>
        </div>
    </div>
  );
}

export default RelayForm;
