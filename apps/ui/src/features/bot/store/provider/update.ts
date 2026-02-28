// apps/ui/src/features/bot/store/provider/update.ts
// 内部引用
import type { ProviderId, ProviderState } from "@/features/bot/types";

type ProviderSlice = "providerConfig" | "providerStatus" | "providerModels";

export const withSlice = <T extends ProviderSlice>(
  state: ProviderState,
  slice: T,
  providerId: ProviderId,
  value: ProviderState[T][ProviderId],
): Pick<ProviderState, T> =>
  ({
    [slice]: { ...state[slice], [providerId]: value },
  }) as Pick<ProviderState, T>;
