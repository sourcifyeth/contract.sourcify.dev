"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchChains } from "@/utils/api";
import { ChainData } from "@/types/chain";

export default function HomeClient() {
  const router = useRouter();
  const [chainId, setChainId] = useState("1");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chains, setChains] = useState<ChainData[]>([]);
  const [chainsLoading, setChainsLoading] = useState(true);

  useEffect(() => {
    async function loadChains() {
      try {
        setChainsLoading(true);
        const chainsData = await fetchChains();
        setChains(chainsData);
      } catch (err) {
        console.error("Error loading chains:", err);
      } finally {
        setChainsLoading(false);
      }
    }

    loadChains();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!address) {
      setError("Please enter a contract address");
      return;
    }

    // Clear any previous errors
    setError(null);
    setIsLoading(true);

    // Navigate to the contract page
    router.push(`/${chainId}/${address}`);
  };

  // Filter chains to only show supported ones
  const supportedChains = chains.filter((chain) => chain.supported);

  return (
    <>
      <form className="mt-5 sm:flex sm:items-end" onSubmit={handleSubmit}>
        <div className="w-full sm:max-w-xs mr-3">
          <label htmlFor="chainId" className="block text-sm font-medium text-gray-700">
            Chain
          </label>
          <select
            id="chainId"
            name="chainId"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            disabled={chainsLoading}
          >
            {chainsLoading ? (
              <option value="">Loading chains...</option>
            ) : (
              supportedChains.map((chain) => (
                <option key={chain.chainId} value={chain.chainId.toString()}>
                  {chain.name} ({chain.chainId})
                </option>
              ))
            )}
          </select>
        </div>
        <div className="w-full mt-3 sm:mt-0">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Contract Address
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="address"
              id="address"
              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              type="submit"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading || chainsLoading}
            >
              {isLoading ? "Loading..." : "View Contract"}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700">Example Contracts</h4>
        <ul className="mt-2 space-y-2 text-sm text-gray-600">
          <li>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                setChainId("1");
                setAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
                router.push("/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
              }}
            >
              USDC (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
            </button>
          </li>
          <li>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                setChainId("1");
                setAddress("0x6B175474E89094C44Da98b954EedeAC495271d0F");
                router.push("/1/0x6B175474E89094C44Da98b954EedeAC495271d0F");
              }}
            >
              DAI (0x6B175474E89094C44Da98b954EedeAC495271d0F)
            </button>
          </li>
          <li>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                setChainId("100");
                setAddress("0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d");
                router.push("/100/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d");
              }}
            >
              wxDAI on Gnosis (0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d)
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
