import './App.css';
import { useEffect, useState } from 'react';

const App = () => {

  const isWalletConnected = () => window.ethereum;

  const getAuthorisedAccounts = async () => {
    if (!isWalletConnected()) {
      console.log("Make sure you have metamask");
      return [];
    }

    const { ethereum } = window;

    return await ethereum.request({ method: 'eth_accounts' });
  }

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const accounts = await getAuthorisedAccounts();

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorised account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorised account found");
    }
  };

  const connectWallet = async () => {
    try {
      if (!isWalletConnected()) {
        alert("Download Metamask plugin to use this website");
        return;
      }
  
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      setCurrentAccount(account);
    } catch (e) {
      console.error(e);
    }
  }

  const renderNotConnectedContainer = () => {
    if (currentAccount == "") {
      return (
        <button onClick={connectWallet}>
          Connect your wallet
        </button>
      );
    }
  }

  const renderMintContainerContainer = () => {
    if (currentAccount !== "") {
      return (
        <button>
          Mint your NFT
        </button>
      );
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div>
      <header>
        <h1>My NFT collection</h1>
        <h2>Each unique. Each beautiful. Discover your NFT today.</h2>
      </header>
      <main>
        {renderNotConnectedContainer()}
        {renderMintContainerContainer()}
      </main>
      <footer>
        <a target="_blank" href="http://twitter.com/newtonbeck">@newtonbeck</a>
      </footer>
    </div>
  );
}

export default App;
