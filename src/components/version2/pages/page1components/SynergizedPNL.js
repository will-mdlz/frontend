import PnLTemplate from "./PnLTemplate/PnLTemplate";
import { Divider } from "@mui/material";

const SynergizedPNL = () => {
  return (
  <div>
    <PnLTemplate val={0} />
    <Divider sx={{ mt: 1, mb: 1, borderBottomWidth: 2, backgroundColor: 'black' }} />
    {<PnLTemplate val={1} />}
  </div>
  );
};

export default SynergizedPNL;