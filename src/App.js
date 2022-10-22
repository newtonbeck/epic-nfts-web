import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import myEpicNFT from './utils/MyEpicNFT.json';

const App = () => {

  const CONTRACT_ADDRESS = "0xD5391e75E4e3DeE5672252665f30abA1BaA20193";

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

  const [mining, setMining] = useState(false);

  const [minedNFT, setMinedNFT] = useState(null);

  const checkIfWalletIsConnected = async () => {
    const accounts = await getAuthorisedAccounts();

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorised account:", account);
      setCurrentAccount(account);
      setUpEventListener();
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
      setUpEventListener();
    } catch (e) {
      console.error(e);
    }
  }

  const connectToContract = () => {
      const { ethereum } = window;
      const web3Provider = new ethers.providers.Web3Provider(ethereum);
      const signer = web3Provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, myEpicNFT.abi, signer);
  }

  const mintNFT = async () => {
    try {
      const connectedContract = connectToContract();

      console.log("Going to pop wallet now to pay gas...");
      const transaction = await connectedContract.makeAnEpicNFT();

      setMining(true);

      console.log("Mining... please wait");
      await transaction.wait();

      console.log(`Mined, see transaction https://goerli.etherscan.io/tx/${transaction.hash}`);
    } catch (e) {
      console.error(e);
    } finally {
      setMining(false);
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
    if (currentAccount == "") {
      return;
    }
    if (!mining) {
      return (
        <button onClick={mintNFT}>
          Mint your NFT
        </button>
      );
    } else {
      return (
        <span>Minting your NFT, this may take some seconds...</span>
      );
    }
  }

  const renderMintedNFTContainerContainer = () => {
    if (minedNFT !== null) {
      return (
        <div>
          <h2>Congratulations, your NFT is minted!</h2>

          <a target="_blank" href={`https://testnet.rarible.com/collection/${CONTRACT_ADDRESS}`}>Check out your collection here</a>
          <br/>
          <a target="_blank" href={`https://testnet.rarible.com/token/${CONTRACT_ADDRESS}:${minedNFT.tokenId}`}>Check out your newly minted NFT here</a>
        </div>
      );
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const setUpEventListener = () => {
    const connectedContract = connectToContract();

    connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
      setMinedNFT({ from, tokenId });
    });
  }

  return (
    <div>
      <header>
        <h1>My NFT collection</h1>
        <h2>Each unique. Each beautiful. Discover your NFT today.</h2>
      </header>
      <main>
        {renderNotConnectedContainer()}
        {renderMintContainerContainer()}
        {renderMintedNFTContainerContainer()}
      </main>
      <footer>
        <a target="_blank" href="http://twitter.com/newtonbeck">@newtonbeck</a>
      </footer>
    </div>
  );
}

export default App;
