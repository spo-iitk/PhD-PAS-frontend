import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import Meta from "@components/Meta";
import useStore from "@store/store";
import proformaRequest, { ProformaType } from "@callbacks/company/proforma";
import companyRequest, { HR } from "@callbacks/company/company";
import { StagesofPhD } from "@components/Utils/matrixUtils";

const ROUTE = "/company/rc/[rcId]";

function Step4() {
  const router = useRouter();
  const { rcid, proformaid } = router.query;
  const rid = (rcid || "").toString();
  const pid = (proformaid || "").toString();
  const { token } = useStore();
  const [fetchData, setFetch] = useState<ProformaType>({
    ID: 0,
  } as ProformaType);
  const [HRdata, setHR] = useState<HR>({ name: "", hr1: "", hr2: "", hr3: "" });
  const [stageofPhD, setStageofPhD] = useState<string[]>([]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProformaType>({
    defaultValues: fetchData,
  });
  const handleStageChange = (event: SelectChangeEvent<typeof stageofPhD>) => {
    const {
      target: { value },
    } = event;
    setStageofPhD(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleNext = async (data: ProformaType) => {
    const info = {
      ...data,
      additional_eligibility: stageofPhD.join(","),
      ID: parseInt(pid, 10),
    };
    const res = await proformaRequest.put(token, rid, info);
    if (res) {
      reset({
        additional_eligibility: "",
        message_for_cordinator: "",
        active_hr: "",
      });
      router.push({
        pathname: ROUTE,
        query: { rcId: rid },
      });
    }
  };
  useEffect(() => {
    if (!(rid && pid)) return;
    const getStep5 = async () => {
      const data = await proformaRequest.get(token, rid, pid);
      const hr = await companyRequest.getHR(token, rid);
      setHR(hr);
      setFetch(data);
      reset(data);
    };
    getStep5();
  }, [rid, pid, token, reset]);

  return (
    <div>
      <Meta title="Step 5 - Additional Information" />
      <Card
        elevation={5}
        sx={{
          padding: 3,
          width: { xs: "330px", sm: "600px", margin: "0px auto" },
        }}
      >
        <Stack spacing={3}>
          <h2>Step 4/4 : Additional Information</h2>
          <FormControl sx={{ m: 1 }}>
            <p style={{ fontWeight: 300 }}>Stage of PhD Eligible</p>
            <Select
              id="Cname"
              multiple
              required
              value={stageofPhD}
              onChange={handleStageChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{ marginLeft: "5 rem" }}
              error={!!errors.additional_eligibility}
            >
              {StagesofPhD.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  <Checkbox checked={stageofPhD.indexOf(stage) > -1} />
                  <ListItemText primary={stage} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1 }}>
            <p style={{ fontWeight: 300 }}>Message for Placement Coordinator</p>
            <TextField
              id="Cname"
              required
              sx={{ marginLeft: "5 rem" }}
              fullWidth
              multiline
              minRows={5}
              variant="standard"
              error={!!errors.message_for_cordinator}
              helperText={
                errors.message_for_cordinator && "This field is required!"
              }
              {...register("message_for_cordinator")}
            />
          </FormControl>

          <FormControl sx={{ m: 1 }}>
            <p style={{ fontWeight: 300 }}>Select Active HR</p>
            <Autocomplete
              disablePortal
              id="select-active-hr"
              options={[
                {
                  id: 1,
                  label: HRdata.hr1,
                },
                {
                  id: 2,
                  label: HRdata.hr2,
                },
                {
                  id: 3,
                  label: HRdata.hr3,
                },
              ]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="standard"
                  error={!!errors.active_hr}
                  helperText={errors.active_hr && "This field is required!"}
                  {...register("active_hr", { required: true })}
                />
              )}
            />
          </FormControl>

          <Stack
            spacing={3}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              sx={{ width: "50%" }}
              disabled={!router.isReady || rid === ""}
              onClick={handleSubmit(handleNext)}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              sx={{ width: "50%" }}
              onClick={() => {
                reset({
                  additional_eligibility: "",
                  message_for_cordinator: "",
                  active_hr: "",
                });
              }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
}

Step4.layout = "companyPhaseDashboard";
export default Step4;
