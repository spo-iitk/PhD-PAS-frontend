import { GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Modal, Stack, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EditIcon from "@mui/icons-material/Edit";
import SyncIcon from "@mui/icons-material/Sync";
import { AcUnit } from "@mui/icons-material";

import DataGrid from "@components/DataGrid";
import useStore from "@store/store";
import getStudents, { Student } from "@callbacks/admin/rc/student/getStudents";
import { errorNotification } from "@callbacks/notifcation";
import EditStudent from "@components/Modals/EditStudentDetails";
import Meta from "@components/Meta";
import Enroll from "@components/Modals/Enroll";
import Sync from "@components/Modals/Sync";
import Freeze from "@components/Modals/Freeze";
import Unfreeze from "@components/Modals/Unfreeze";
import { getDeptProgram } from "@components/Parser/parser";
import DeleteConfirmation from "@components/Modals/DeleteConfirmation";
import AdminStudentRequest, {Student as AdminStudent,} from "@callbacks/admin/student/adminStudent";

function DeleteStudents(props: { id: string }) {
  const { token } = useStore();
  const { id } = props;
  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const handleOpenDeleteModal = () => {
    setDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };
  useEffect(() => {
    if (confirmation) {
      getStudents.deleteStudent(token, rid, id);
    }
  }, [confirmation, id, rid, token]);
  return (
    <>
      <IconButton
        onClick={() => {
          handleOpenDeleteModal();
        }}
      >
        <DeleteIcon />
      </IconButton>
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DeleteConfirmation
          handleClose={handleCloseDeleteModal}
          setConfirmation={setConfirmation}
        />
      </Modal>
    </>
  );
}

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "roll_no",
    headerName: "Roll No.",
    width: 100,
  },
  {
    field: "cpi",
    headerName: "CPI",
    width: 100,
  },
  {
    field: "program_department_id",
    headerName: "Department",
    width: 100,
    valueGetter: (params) => getDeptProgram(params.value),
  },
  // {
  //   field: "secondary_program_department_id",
  //   headerName: "Secondary Department",
  //   width: 200,
  //   valueGetter: (params) => getDeptProgram(params.value),
  // },
  {
    field: "student_id",
    headerName: "Student ID",
    width: 100,
    hide: true,
  },
  {
    field: "is_frozen",
    headerName: "Frozen",
    width: 100,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "stage_of_phd",
    headerName: "stage of phd",
    width: 100,
  },
  {
    field: "options",
    headerName: "",
    align: "center",
    width: 100,
    hide: true,
    renderCell: (cellValues) => (
      <DeleteStudents id={cellValues.id.toString()} />
    ),
  },
  {
    field: "Actions",
    headerName: "Actions",
    align: "center",
    width: 100,
    renderCell: (params) => (
      <Button
        href={`/admin/rc/${params.row.recruitment_cycle_id}/student/${params.row.id}`}
        variant="contained"
      >
        View Details
      </Button>
    ),
  },
];
function Index() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any>([]);
  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();
  const { token, rcName, role } = useStore();
  const [showButtons, setShowButtons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openEnroll, setOpenEnroll] = useState(false);
  const handleOpenEnroll = () => {
    setOpenEnroll(true);
  };
  const handleCloseEnroll = () => {
    setOpenEnroll(false);
  };

  // const [openDeregister, setOpenDeregister] = useState(false);
  // const handleOpenDeregister = () => {
  //   setOpenDeregister(true);
  // };
  // const handleCloseDeregister = () => {
  //   setOpenDeregister(false);
  // };

  const fetchAllStudents = useCallback(async () => {
  if (!rid) return;

  setLoading(true);

  try {
    const rcStudents = await getStudents.getAllStudents(token, rid);

    const adminStudents = await AdminStudentRequest.getAll(token);

    const stageMap = new Map<number, string>();
    adminStudents.forEach((s: AdminStudent) => {
      stageMap.set(s.ID, s.stage_of_phd);
    });
    console.log(adminStudents)
    console.log(rcStudents)

    setRows(
      rcStudents.map((student) => ({
        id: student.ID,
        name: student.name,
        email: student.email,
        roll_no: student.roll_no,
        cpi: student.cpi,
        program_department_id: student.program_department_id,
        secondary_program_department_id: student.secondary_program_department_id,
        recruitment_cycle_id: student.recruitment_cycle_id,
        student_id: student.student_id,
        is_frozen: student.is_frozen,
        type: student.type,
        stage_of_phd: stageMap.get(student.student_id) || "",
      }))
    );
  } catch (err) {
    errorNotification("Failed to get Students", "Something went wrong");
  } finally {
    setLoading(false);
  }
}, [rid, token]);

  const [openSync, setOpenSync] = useState(false);
  const handleOpenSync = () => {
    setOpenSync(true);
  };
  const handleCloseSync = () => {
    fetchAllStudents();
    setOpenSync(false);
  };

  const [openFreeze, setOpenFreeze] = useState(false);
  const handleOpenFreeze = () => {
    setOpenFreeze(true);
  };
  const handleCloseFreeze = () => {
    setOpenFreeze(false);
  };

  const [openUnFreeze, setOpenUnFreeze] = useState(false);
  const handleOpenUnFreeze = () => {
    setOpenUnFreeze(true);
  };
  const handleCloseUnFreeze = () => {
    setOpenUnFreeze(false);
  };

  useEffect(() => {
    if (role !== 103) setShowButtons(true);
    fetchAllStudents();
  }, [rid, token, role, fetchAllStudents]);
  const [openNew, setOpenNew] = useState(false);
  const handleOpenNew = () => {
    setOpenNew(true);
  };
  const handleCloseNew = () => {
    setOpenNew(false);
  };
  return (
    <div>
      <Meta title={`Student List - ${rcName}`} />
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <h2>Students</h2>
        {showButtons && (
          <div>
            {/* Feature Not In Use */}
            {/* <Tooltip title="Deregister All Students">
              {role === 100 || role === 101 ? (
                <IconButton onClick={handleOpenDeregister}>
                  <GroupRemoveIcon />
                </IconButton>
              ) : (
                <div />
              )}
            </Tooltip> */}
            <Tooltip title="Edit Student Data">
              {role === 100 ? (
                <IconButton onClick={handleOpenNew}>
                  <EditIcon />
                </IconButton>
              ) : (
                <div />
              )}
            </Tooltip>
            <Tooltip title="Sync Student Data with Master">
              <IconButton onClick={handleOpenSync}>
                <SyncIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="UnFreeze Students">
              <IconButton onClick={handleOpenUnFreeze}>
                <HowToRegIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Freeze Students">
              <IconButton onClick={handleOpenFreeze}>
                <AcUnit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Enroll Students">
              <IconButton onClick={handleOpenEnroll}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </Stack>
      <Modal open={openNew} onClose={handleCloseNew}>
        <EditStudent
          handleCloseNew={handleCloseNew}
          setRows={setRows}
          studentData={rows}
          rcid={rid}
        />
      </Modal>
      {/* <Modal open={openDeregister} onClose={handleCloseDeregister}>
        <Deregister handleClose={handleCloseDeregister} rid={rid} />
      </Modal> */}
      <Modal open={openEnroll} onClose={handleCloseEnroll}>
        <Enroll handleClose={handleCloseEnroll} />
      </Modal>
      <Modal open={openSync} onClose={handleCloseSync}>
        <Sync handleClose={handleCloseSync} rid={rid} />
      </Modal>
      <Modal open={openFreeze} onClose={handleCloseFreeze}>
        <Freeze handleClose={handleCloseFreeze} rid={rid} />
      </Modal>
      <Modal open={openUnFreeze} onClose={handleCloseUnFreeze}>
        <Unfreeze handleClose={handleCloseUnFreeze} rid={rid} />
      </Modal>
      <DataGrid rows={rows} columns={columns} loading={loading} />
    </div>
  );
}
Index.layout = "adminPhaseDashBoard";
export default Index;
