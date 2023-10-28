/* eslint-disable no-nested-ternary */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import {
  Branches,
  func,
  totalDeptKeywords,
} from "@components/Utils/matrixUtils";

function MatrixExpanded({ data }: { data: string }) {
  if (data?.length < 110)
    return <Typography>Eligibility Matrix Not Found</Typography>;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {Branches.map((branch) => (
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                {branch}
              </TableCell>
              <TableCell>
                <Table sx={{ minWidth: 650 }} aria-label="keywords table">
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
                            {data[value] === "1" ? (
                              <CheckIcon sx={{ color: "green" }} />
                            ) : (
                              <CloseIcon sx={{ color: "red" }} />
                            )}
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
  );
}

export default MatrixExpanded;
