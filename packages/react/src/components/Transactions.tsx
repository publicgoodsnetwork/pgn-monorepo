import { PropsWithChildren, memo } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { TokenBridgeMessage } from "@eth-optimism/sdk";
import toast from "react-hot-toast";
import { ConnectWallet } from "./ConnectButton";
import { Link } from "./ui/Link";
import { SecondaryButton } from "./ui/Button";
import { Alert, AlertTitle } from "./ui/Alert";
import { Table, Tbody, Td, Th, Thead, Tr } from "./ui/Table";

import { timeAgo } from "../utils/date";
import { truncate } from "../utils/truncate";

import {
  useBlock,
  useChallengePeriod,
  useFinalize,
  useProve,
  useWithdrawalReceipt,
  useWithdrawalStatus,
  useWithdrawals,
} from "../hooks/transactions";

import { usePGN } from "..";
import { Skeleton } from "./ui/Skeleton";
import { parseEthersError } from "../utils/revertReason";

export const Transactions = memo(() => {
  const {
    networks: { l1 },
  } = usePGN();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const isCorrectChain = chain?.network === l1.network;

  if (!address) {
    return (
      <div className="flex justify-center">
        <Alert>
          <AlertTitle>Connect Wallet</AlertTitle>
          <p>Connect your wallet to see your transactions.</p>
          <ConnectWallet chain={chain} />
        </Alert>
      </div>
    );
  }
  if (!isCorrectChain) {
    return (
      <div className="flex justify-center">
        <Alert>
          <AlertTitle>Unsupported network</AlertTitle>
          <p>Please switch to a supported network.</p>
          <ConnectWallet chain={l1} />
        </Alert>
      </div>
    );
  }

  return <TransactionsTable />;
});

const TransactionsTable = memo(() => {
  const { data, error, isLoading } = useWithdrawals();
  const { data: challengePeriod } = useChallengePeriod();
  return (
    <Table>
      <Thead>
        <Tr>
          <Th className="w-40">Hash</Th>
          <Th>Status</Th>
          <Th>Timestamp</Th>
          <Th>L1 hash</Th>
          <Th>Time left</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {isLoading ? (
          <Tr>
            {Array.from({ length: 6 }).map((_, i) => (
              <Td key={i}>
                <Skeleton isLoading />
              </Td>
            ))}
          </Tr>
        ) : data?.length ? (
          data.map((tx) => (
            <TransactionRow
              key={tx.transactionHash}
              challengePeriod={challengePeriod}
              {...tx}
            />
          ))
        ) : (
          <Tr>
            <Td colSpan={6} className="text-center">
              No transactions found
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
});

const withdrawStatusMap = {
  2: "Waiting for state root",
  3: "Ready to prove",
  4: "In challenge period",
  5: "Ready to relay",
  6: "Relayed",
};
const TransactionRow = ({
  transactionHash,
  blockNumber,
  challengePeriod = 0,
}: TokenBridgeMessage & { challengePeriod?: number }) => {
  const { data: timestamp = 0 } = useBlock(blockNumber);
  const {
    networks: { l1, l2 },
  } = usePGN();
  const status = useWithdrawalStatus(transactionHash);
  const receipt = useWithdrawalReceipt(transactionHash, status?.data as number);
  const l1hash = receipt.data?.transactionReceipt.transactionHash;

  const statusText =
    withdrawStatusMap[status.data as keyof typeof withdrawStatusMap] ||
    "<unknown>";

  const timeLeft = timestamp ? timeAgo(timestamp + challengePeriod) : null;
  return (
    <Tr>
      <Td>
        <Link
          className="font-mono"
          target="_blank"
          title={transactionHash}
          href={`${l2.blockExplorers?.default.url}/tx/${transactionHash}`}
        >
          {truncate(transactionHash)}
        </Link>
      </Td>
      <Td>
        <Skeleton isLoading={status.isLoading}>{statusText}</Skeleton>
      </Td>
      <Td>{timestamp ? <>{timeAgo(timestamp)}</> : null}</Td>
      <Td>
        <Skeleton isLoading={receipt.isLoading}>
          {l1hash ? (
            <Link
              className="font-mono"
              target="_blank"
              title={l1hash}
              href={`${l1.blockExplorers?.default.url}/tx/${l1hash}`}
            >
              {truncate(l1hash)}
            </Link>
          ) : (
            "N/A"
          )}
        </Skeleton>
      </Td>
      <Td>{timeLeft}</Td>
      <Td>
        {status.data === 3 ? <ProveButton hash={transactionHash} /> : null}
        {status.data === 5 ? <FinalizeButton hash={transactionHash} /> : null}
      </Td>
    </Tr>
  );
};

const ProveButton = ({ hash }: { hash: string }) => {
  const prove = useProve();
  const queryClient = useQueryClient();
  return (
    <SecondaryButton
      className="w-32"
      onClick={() =>
        prove.mutate(hash, {
          onSuccess: () =>
            queryClient.setQueryData(["withdrawal-status", hash], 4),
          onError: (error) =>
            toast.error(parseEthersError(error as string) as string),
        })
      }
      disabled={prove.isLoading}
    >
      {prove.isLoading ? "Proving..." : "Prove"}
    </SecondaryButton>
  );
};

const FinalizeButton = ({ hash }: { hash: string }) => {
  const finalize = useFinalize();
  const queryClient = useQueryClient();
  return (
    <SecondaryButton
      className="w-32"
      onClick={() =>
        finalize.mutate(hash, {
          onSuccess: () =>
            queryClient.setQueryData(["withdrawal-status", hash], 6),
          onError: (error) =>
            toast.error(parseEthersError(error as string) as string),
        })
      }
      disabled={finalize.isLoading}
    >
      {finalize.isLoading ? "Finalizing..." : "Finalize"}
    </SecondaryButton>
  );
};
