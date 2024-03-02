import { Button, Card, IconButton, Stack } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  Branches,
  func,
  totalDeptKeywords,
} from "@components/Utils/matrixUtils";
import Meta from "@components/Meta";
import useStore from "@store/store";
import requestProforma, {
  AdminProformaType,
} from "@callbacks/admin/rc/adminproforma";

const ROUTE = "/admin/rc/[rcid]/proforma/[proformaid]/step3";

function Step2() {
  const [str, setStr] = useState(new Array(totalDeptKeywords + 1).join("0"));
  const router = useRouter();
  const { rcid, proformaid } = router.query;
  const rid = (rcid || "").toString();
  const pid = (proformaid || "").toString();
  const { token } = useStore();
  useEffect(() => {
    if (!(rid && pid)) return;
    const getStep2 = async () => {
      const data = await requestProforma.get(token, rid, pid);
      if (data.eligibility.length === totalDeptKeywords + 1)
        setStr(data.eligibility);
    };
    getStep2();
  }, [rid, pid, token]);
  const handleNext = async () => {
    const info = {
      eligibility: str,
      ID: parseInt(pid, 10),
    } as AdminProformaType;
    await requestProforma.put(token, rid, info).then(() => {
      router.push({
        pathname: ROUTE,
        query: { rcid: rid, proformaid: pid },
      });
    });
  };

  const handleCheckAll = () => {
    setStr(new Array(totalDeptKeywords + 2).join("1"));
  };

  const handleReset = () => {
    setStr(new Array(totalDeptKeywords + 2).join("0"));
  };

  const handleBranchWise = (branchName: string) => {
    let newStr = str;
    Object.keys(func[branchName as keyof typeof func]).forEach((keyword) => {
      const temp = func[branchName as keyof typeof func];
      const idx =
        func[branchName as keyof typeof func][keyword as keyof typeof temp];
      let idn = parseInt(idx, 10);
      if (idn !== -1) {
        newStr = `${newStr.substring(0, idn)}1${newStr.substring(idn + 1)}`;
      }
    });
    setStr(newStr);
  };

  const handleCheck = (branch: string, keyword: string) => {
    const temp = func[branch as keyof typeof func];
    const idx = func[branch as keyof typeof func][keyword as keyof typeof temp];
    let newStr = str;
    let idn = parseInt(idx, 10);
    if (str[idn] === "1") {
      newStr = `${newStr.substring(0, idn)}0${newStr.substring(idn + 1)}`;
    } else {
      newStr = `${newStr.substring(0, idn)}1${newStr.substring(idn + 1)}`;
    }
    setStr(newStr);
  };

  return (
    <div>
      <Meta title="Step 2 - New Opening" />
      <Card sx={{ padding: 3 }}>
        <h2>Step 2/4 (Eligibility Matrix)</h2>
        <Stack spacing={4} alignItems="center">
          <Stack spacing={1}>
            <Stack spacing={4} direction="row" alignItems="center">
              <IconButton onClick={handleCheckAll}>
                <CheckCircleIcon />
              </IconButton>
              <h3>Select all</h3>
            </Stack>
          </Stack>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {Branches.map((branch) => (
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: 600 }}
                    >
                      <Button onClick={() => handleBranchWise(branch)}>
                        {branch}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        {Object.keys(func[branch as keyof typeof func]).map(
                          (keyword) => {
                            const temp = func[branch as keyof typeof func];
                            const value =
                              func[branch as keyof typeof func][
                                keyword as keyof typeof temp
                              ];
                            return (
                              <TableRow>
                                <TableCell>{keyword}</TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={str[parseInt(value, 10)] === "1"}
                                    onClick={() => handleCheck(branch, keyword)}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </Table>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack
            direction="row"
            spacing={5}
            sx={{ width: { xs: "330px", md: "500px" } }}
          >
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={handleNext}
            >
              Next
            </Button>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

Step2.layout = "adminPhaseDashBoard";
export default Step2;
