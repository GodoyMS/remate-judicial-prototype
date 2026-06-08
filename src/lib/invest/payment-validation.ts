import type { CardFormData } from "@/components/dashboard/invest/CardPaymentForm";
import type { TransferFormData } from "@/components/dashboard/invest/BankTransferForm";
import type { DepositFormData } from "@/components/dashboard/invest/DepositForm";
import type { YapeFormData } from "@/components/dashboard/invest/YapePaymentForm";
import { isCardFormValid } from "@/components/dashboard/invest/CardPaymentForm";
import { isTransferFormValid } from "@/components/dashboard/invest/BankTransferForm";
import { isDepositFormValid } from "@/components/dashboard/invest/DepositForm";
import { isYapeFormValid } from "@/components/dashboard/invest/YapePaymentForm";

export type PaymentMethodId = "card" | "transfer" | "deposit" | "yape";

export function isPaymentFormValid(
  paymentMethod: string | null,
  forms: {
    card: CardFormData;
    transfer: TransferFormData;
    deposit: DepositFormData;
    yape: YapeFormData;
  }
): boolean {
  switch (paymentMethod) {
    case "card":
      return isCardFormValid(forms.card);
    case "transfer":
      return isTransferFormValid(forms.transfer);
    case "deposit":
      return isDepositFormValid(forms.deposit);
    case "yape":
      return isYapeFormValid(forms.yape);
    default:
      return false;
  }
}

export function getPaymentValidationHint(
  paymentMethod: string | null,
  forms: {
    card: CardFormData;
    transfer: TransferFormData;
    deposit: DepositFormData;
    yape: YapeFormData;
  }
): string | null {
  if (!paymentMethod) {
    return "Selecciona un método de pago para continuar.";
  }

  if (paymentMethod === "card") {
    const { card } = forms;
    if (card.cardNumber.replace(/\D/g, "").length < 15) {
      return "Ingresa un número de tarjeta válido (mín. 15 dígitos).";
    }
    if (card.cardholder.trim().length < 3) {
      return "Ingresa el nombre del titular como aparece en la tarjeta.";
    }
    if (card.expiry.replace(/\D/g, "").length !== 4) {
      return "Ingresa la fecha de vencimiento (MM / AA).";
    }
    if (card.cvv.replace(/\D/g, "").length < 3) {
      return "Ingresa el código CVV de tu tarjeta.";
    }
    return null;
  }

  if (paymentMethod === "transfer") {
    const { transfer } = forms;
    if (transfer.accountNumber.trim().length < 8) {
      return "Ingresa el número de cuenta desde la que realizaste la transferencia.";
    }
    if (transfer.transferNumber.trim().length < 4) {
      return "Ingresa el número o referencia de la transferencia.";
    }
    if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
      return "Confirma el monto transferido.";
    }
    if (!transfer.receipt) {
      return "Adjunta el recibo o comprobante de la transferencia.";
    }
    return null;
  }

  if (paymentMethod === "deposit") {
    const { deposit } = forms;
    if (deposit.voucherNumber.trim().length < 3) {
      return "Ingresa el número del voucher de depósito.";
    }
    if (!deposit.voucherDate) {
      return "Selecciona la fecha del depósito.";
    }
    if (deposit.operationNumber.trim().length < 4) {
      return "Ingresa el número de operación bancaria.";
    }
    if (!deposit.amount || parseFloat(deposit.amount) <= 0) {
      return "Confirma el monto depositado.";
    }
    if (!deposit.receipt) {
      return "Adjunta el voucher o comprobante del depósito.";
    }
    return null;
  }

  if (paymentMethod === "yape") {
    const digits = forms.yape.phone.replace(/\D/g, "");
    if (digits.length !== 9 || !digits.startsWith("9")) {
      return "Ingresa un número Yape válido (9 dígitos, inicia con 9).";
    }
    if (!/^\d{6}$/.test(forms.yape.approvalCode)) {
      return "Ingresa el código de aprobación de 6 dígitos de tu app Yape.";
    }
    return null;
  }

  return null;
}
