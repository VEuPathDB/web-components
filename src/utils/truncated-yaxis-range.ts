import { truncationConfig } from '../types/plots';

//DKDK A function to generate truncated dependent axis layout range
export function truncatedYAxisLayoutRange(
  truncationConfig?: truncationConfig,
  dataDependentAxisRange?: { min: number | undefined; max: number | undefined },
  dependentAxisLowerExtensionEnd?: number,
  dependentAxisUpperExtensionEnd?: number,
  dependentAxisLogScale?: boolean
) {
  //DKDK dependentAxisLowerExtensionEnd can be less than zero which causes issue for log10
  // const truncatedYAxisLayoutRange =
  //   truncationConfig?.dependentAxis.min && truncationConfig?.dependentAxis.max
  //     ? [dependentAxisLowerExtensionEnd, dependentAxisUpperExtensionEnd].map((val) =>
  //         dependentAxisLogScale && val != null ? Math.log10(val || 1) : val
  //       )
  //   //DKDK
  //     : truncationConfig?.dependentAxis.min === false && truncationConfig?.dependentAxis.max
  //       ? [dataDependentAxisRange?.min, dependentAxisUpperExtensionEnd].map((val) =>
  //           dependentAxisLogScale && val != null ? Math.log10(val || 1) : val
  //         )
  //       : truncationConfig?.dependentAxis.min && truncationConfig?.dependentAxis.max === false
  //         ? [dependentAxisLowerExtensionEnd, dataDependentAxisRange?.max].map((val) =>
  //             dependentAxisLogScale && val != null ? Math.log10(val || 1) : val
  //           )
  //         : [dataDependentAxisRange?.min, dataDependentAxisRange?.max].map((val) =>
  //             dependentAxisLogScale && val != null ? Math.log10(val || 1) : val
  //           )
  const truncatedYAxisLayoutRange =
    truncationConfig?.dependentAxis.min && truncationConfig?.dependentAxis.max
      ? [
          dependentAxisLowerExtensionEnd,
          dependentAxisUpperExtensionEnd,
        ].map((val) =>
          dependentAxisLogScale && val != null
            ? val < 0
              ? 0
              : Math.log10(val)
            : val
        )
      : //DKDK
      truncationConfig?.dependentAxis.min === false &&
        truncationConfig?.dependentAxis.max
      ? [
          dataDependentAxisRange?.min,
          dependentAxisUpperExtensionEnd,
        ].map((val) =>
          dependentAxisLogScale && val != null
            ? val < 0
              ? 0
              : Math.log10(val)
            : val
        )
      : truncationConfig?.dependentAxis.min &&
        truncationConfig?.dependentAxis.max === false
      ? [
          dependentAxisLowerExtensionEnd,
          dataDependentAxisRange?.max,
        ].map((val) =>
          dependentAxisLogScale && val != null
            ? val < 0
              ? 0
              : Math.log10(val)
            : val
        )
      : [dataDependentAxisRange?.min, dataDependentAxisRange?.max].map((val) =>
          dependentAxisLogScale && val != null
            ? val < 0
              ? 0
              : Math.log10(val)
            : val
        );
  // const truncatedYAxisLayoutRange =
  //   truncationConfig?.dependentAxis.min && truncationConfig?.dependentAxis.max
  //     ? [dependentAxisLowerExtensionEnd, dependentAxisUpperExtensionEnd]
  //   //DKDK
  //     : truncationConfig?.dependentAxis.min === false && truncationConfig?.dependentAxis.max
  //       ? [dataDependentAxisRange?.min, dependentAxisUpperExtensionEnd]
  //       : truncationConfig?.dependentAxis.min && truncationConfig?.dependentAxis.max === false
  //         ? [dependentAxisLowerExtensionEnd, dataDependentAxisRange?.max]
  //         : [dataDependentAxisRange?.min, dataDependentAxisRange?.max]

  return truncatedYAxisLayoutRange;
}
