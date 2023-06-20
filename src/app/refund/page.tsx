"use client"
import {
  Heading,
  Text,
} from "@chakra-ui/react";


const Refund = () => {
 
  return (
    <>
      <Heading mb={4}>購票注意事項</Heading>
      <Text fontSize="sm" mb={4}>
        每張票券僅限當日一人（一個錢包帳號）入場
      </Text>
      <Text fontSize="sm" mb={4}>
        購票後請於活動期間完成入場，逾期視同作廢
      </Text>
      <Text fontSize="sm" mb={4}>
        依消費者保護法第19條第2項規定所訂定「通訊交易解除全合理例外情事適用準則」第2條第5款之規定，非以有形媒介提供之數位內容，一經提供即為完成線上服務，無法享有七天猶豫期間之權益，且不得辦理退貨。使用者於本平臺購買NFT數位資產並不適用消費者保護法第19條第2項七天猶豫期間之規定，故不得回復或退款。但您可重新上架至二手交易市場進行販售，若為特殊情況請聯繫客服為您處理。
      </Text>
      <Text fontSize="sm" mb={4}>
        換票需在活動日前第14日前辦理，需檢附完整未使用之票券並聯繫客服，若欲換票之區域已售完則無法進行換票，每張票券需酌收票面價格之 30% 作為手續費。
      </Text>
      <Text fontSize="sm" mb={4}>
        每筆交易除票價外會依照交易當下Gas price及Gas used所計算出的Gas fee。Gas fee又稱作礦工費，在區塊鏈網路中，每筆交易都需支付礦工費給幫你完成交易的區塊鏈礦工們。
      </Text>
      <Text fontSize="sm" mb={4}>
        購票前請詳閱注意事項，一旦購票完成視為同意上述所有購票須知。
      </Text>
    </>
  );
};

export default Refund;
