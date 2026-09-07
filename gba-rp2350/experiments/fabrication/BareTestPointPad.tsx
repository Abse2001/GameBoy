// A probe contact, not an assembled SMT part: preserve its exposed 1.1 mm
// copper disk while explicitly reducing only the paste aperture to zero.
export const BareTestPointPad = () => (
  <footprint>
    <smtpad
      shape="circle"
      radius="0.55mm"
      portHints={["1"]}
      solderPasteMargin="-0.55mm"
    />
  </footprint>
)
