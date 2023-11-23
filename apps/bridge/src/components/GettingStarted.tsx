export const GettingStarted = () => {
  return (
    <>
      <style jsx>{`
        .paragraph-spacing {
          margin-bottom: 20px;
        }
      `}</style>
      <div className="text-base">
        <b><a
          className="underline"
          target="_blank"
          href="https://docs.publicgoods.network/using-pgn/bridging"
          >Bridging Options on PGN 
          </a></b>
        <ul>
          <li><p className="paragraph-spacing"><a className="underline" target="_blank" href="https://bridge.publicgoods.network">PGN native bridge</a>: L1 to L2 depositing and withdrawing of all officially deployed tokens, including DAI, USDT and GTC. There is a 7-day challenge period and process for withdraws back to L1.</p></li>
          <li><p className="paragraph-spacing"><a className="underline" target="_blank" href="https://www.layerswap.io/app">LayerSwap</a>: L1 to L2 depositing and withdrawing and L2 to L2 bridging for ETH. Withdrawls are not subject to the challenge period and clear in minutes.</p></li>
          <li><p className="paragraph-spacing"><a className="underline" target="_blank" href="https://app.superbridge.app">Superbridge</a>: L1 to L2 depositing and withdrawing of all officially deployed tokens, including DAI, USDT and GTC. There is a 7 day challenge period for withdraws back to L1, with unique features to make the process smooth.</p></li>
        </ul>
      </div>
    </>
  );
};
