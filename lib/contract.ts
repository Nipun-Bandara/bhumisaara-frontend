import { getContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { client } from "./thirdwebClient";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

export const contract = getContract({
  client,
  chain: polygonAmoy,
  address: contractAddress,
});
