
import React, { useState, useCallback } from 'react';
import { generateIcon } from './services/geminiService';
import { createFaviconZip, getHtmlSnippet } from './utils/imageProcessor';
import { LoadingSpinner, DownloadIcon, ImageIcon, SparklesIcon, CopyIcon, CheckIcon } from './components/Icons';

type AppState = {
  prompt: string;
  generatedImage: string | null;
  isGenerating: boolean;
  isExporting: boolean;
  error: string | null;
  zipUrl: string | null;
};

const htmlSnippet = getHtmlSnippet();

const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};


const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    prompt: 'A minimalist logo of a blue rocket ship, vector style',
    generatedImage: null,
    isGenerating: false,
    isExporting: false,
    error: null,
    zipUrl: null,
  });
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!state.prompt || state.isGenerating) return;

    // Revoke old zip URL since it's for a different image
    if (state.zipUrl) {
        URL.revokeObjectURL(state.zipUrl);
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, generatedImage: null, zipUrl: null }));
    setIsCopied(false);

    try {
      const imageData = await generateIcon(state.prompt);
      setState(prev => ({ ...prev, generatedImage: imageData, isGenerating: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, error: 'Failed to generate icon. Please try again.', isGenerating: false }));
    }
  }, [state.prompt, state.isGenerating, state.zipUrl]);

  const handleExportAndDownload = useCallback(async () => {
    if (!state.generatedImage || state.isExporting) return;

    setState(prev => ({ ...prev, isExporting: true, error: null }));
    try {
      const zipBlob = await createFaviconZip(state.generatedImage);
      const url = URL.createObjectURL(zipBlob);
      
      // Revoke previous URL if it exists, to prevent memory leaks
      if (state.zipUrl) {
          URL.revokeObjectURL(state.zipUrl);
      }
      
      setState(prev => ({ ...prev, zipUrl: url, isExporting: false }));
      triggerDownload(url, 'favicon_package.zip');
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, error: 'Failed to create ZIP file. Please try again.', isExporting: false }));
    }
  }, [state.generatedImage, state.isExporting, state.zipUrl]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(htmlSnippet).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  }, []);

  // Effect to clean up the object URL when the component unmounts
  React.useEffect(() => {
    const currentZipUrl = state.zipUrl;
    return () => {
      if (currentZipUrl) {
        URL.revokeObjectURL(currentZipUrl);
      }
    };
  }, [state.zipUrl]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-brand-secondary selection:text-white">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 mb-2">
            AI Favicon Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Describe your perfect icon, and let AI bring it to life.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Input Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg">
            <form onSubmit={handleGenerate}>
              <label htmlFor="prompt" className="block text-lg font-semibold text-gray-300 mb-2">
                1. Describe your icon
              </label>
              <textarea
                id="prompt"
                rows={4}
                value={state.prompt}
                onChange={(e) => setState(prev => ({...prev, prompt: e.target.value}))}
                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:outline-none transition-all duration-200 placeholder-gray-500"
                placeholder="e.g., A minimalist logo of a brain made of circuits"
              />
              <button
                type="submit"
                disabled={state.isGenerating}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {state.isGenerating ? <LoadingSpinner /> : <SparklesIcon />}
                {state.isGenerating ? 'Generating...' : 'Generate Icon'}
              </button>
            </form>
          </div>

          {/* Right Side: Output */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg flex flex-col justify-between">
             <div>
                <h2 className="text-lg font-semibold text-gray-300 mb-2">2. Your Generated Icon</h2>
                <div className="aspect-square bg-gray-900 border border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    {state.isGenerating && <LoadingSpinner size="h-10 w-10" />}
                    {!state.isGenerating && !state.generatedImage && <ImageIcon />}
                    {state.generatedImage && (
                        <img 
                            src={`data:image/png;base64,${state.generatedImage}`} 
                            alt="Generated icon"
                            className="w-full h-full object-contain rounded-lg p-2"
                        />
                    )}
                </div>
             </div>

            {state.error && <p className="text-red-400 mt-4 text-center">{state.error}</p>}
            
            <div className="mt-4 flex flex-col gap-4">
              {state.generatedImage && !state.zipUrl && (
                <button
                  onClick={handleExportAndDownload}
                  disabled={state.isExporting}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {state.isExporting ? <LoadingSpinner /> : <DownloadIcon />}
                  {state.isExporting ? 'Packaging...' : 'Package & Download ZIP'}
                </button>
              )}
              {state.zipUrl && (
                 <>
                    <button
                      onClick={() => triggerDownload(state.zipUrl!, 'favicon_package.zip')}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      <DownloadIcon />
                      Download Again
                    </button>

                    <div className="pt-2">
                        <h3 className="text-base font-semibold text-gray-300 mb-2">3. Add to your HTML &lt;head&gt;</h3>
                        <div className="relative bg-gray-900 rounded-lg border border-gray-700">
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-secondary"
                                aria-label="Copy code"
                            >
                                {isCopied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                            </button>
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto p-4 font-mono">
                                <code>
                                    {htmlSnippet}
                                </code>
                            </pre>
                        </div>
                         {isCopied && <p className="text-green-400 text-xs mt-2 text-center">Copied to clipboard!</p>}
                    </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
