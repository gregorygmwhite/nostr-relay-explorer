
import { useState, FormEvent } from 'react';
import urls from '../../config/urls';
import pages from '../../config/pages';
import { useNavigate } from 'react-router-dom';
import { generateFullApiURL} from '../../utils/api'

const RelayForm: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const fullAPIRoute = generateFullApiURL(urls.api.relaysCreate)

    const res = await fetch(fullAPIRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (res.status === 200 || res.status === 201) {
      navigate(pages.getRelayView(data.id));
    } else {
      console.log(data)
      let errorReason = "Unknown error";
      if (data.url) {
        errorReason = data.url[0];
      }
      alert('Failed to create relay: ' + errorReason);
    }
  };

  return (
    <div className="container mt-4">
        <h1 className="h3 font-weight-bold mb-4 text-center">Create Relay</h1>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                  className="form-control"
                  id="url"
                  type="text"
                  value={url}
                  placeholder="wss://relay.damus.io"
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="text-right mt-4">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}

export default RelayForm;
