import {useState} from "react";
import {Header} from "../components/Header.tsx";
import {useFetchAllParticipants} from "../hooks/getAll";
import {Participant} from "../types";
import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import "./contentStyle.css";

export function PeopleManagement() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const {
        data: participantsData,
        isLoading,
        isError,
    } = useFetchAllParticipants();

    const validParticipantsData = participantsData || [];

    const filteredParticipants = Array.isArray(validParticipantsData)
        ? validParticipantsData.filter(
            (participant: Participant) =>
                participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (participant.baseName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className="body-simulator">
            <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen}/>
            <main className="content-container">
                <div className="header-content">
                    <img src="/Samu-logo.png" className="samu-logo" alt="SAMU Logo"/>
                    <h2>Gerenciamento de Participantes</h2>
                </div>

                <div className="people-management-content">
                    <Box sx={{display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap'}}>
                        <TextField
                            label="Pesquisar por nome ou base"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{flexGrow: 1}}
                        />
                    </Box>

                    {isLoading && (
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                            <CircularProgress/>
                        </Box>
                    )}

                    {isError && (
                        <Typography variant="h6" color="error" sx={{textAlign: 'center', mt: 2}}>
                            Erro ao carregar participantes
                        </Typography>
                    )}

                    {!isLoading && !isError && validParticipantsData.length > 0 && filteredParticipants.length === 0 && (
                        <Typography variant="h6" sx={{textAlign: 'center', mt: 2}}>
                            Nenhum participante encontrado com o termo "{searchTerm}"
                        </Typography>
                    )}

                    {!isLoading && !isError && validParticipantsData.length === 0 && (
                        <Typography variant="h6" sx={{textAlign: 'center', mt: 2}}>
                            Nenhum participante cadastrado.
                        </Typography>
                    )}

                    {!isLoading && !isError && filteredParticipants.length > 0 && (
                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                overflow: 'hidden',
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow sx={{
                                        background: 'linear-gradient(45deg, #1976d2 0%, #2196f3 100%)',
                                    }}>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            border: 'none',
                                            py: 2,
                                        }}>
                                            Nome
                                        </TableCell>
                                        <TableCell align="center" sx={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            border: 'none',
                                            py: 2,

                                        }}
                                        >
                                            Base
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredParticipants.map((participant: Participant, index: number) => (
                                        <TableRow
                                            key={participant.id}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? '#efefef' : '#f9fafb',
                                                '&:hover': {
                                                    backgroundColor: '#f0f7ff',
                                                    transform: 'scale(1.005)',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{
                                                border: 'none',
                                                borderBottom: '1px solid #f0f0f0',
                                                py: 1.5,
                                                fontSize: '0.95rem',
                                                fontWeight: 500
                                            }}>
                                                {participant.name}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    border: 'none',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    py: 1.5,
                                                    fontSize: '0.95rem',
                                                    color: '#555'
                                                }}
                                            >
                                                {participant.baseName || 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </main>
        </div>
    );
}

