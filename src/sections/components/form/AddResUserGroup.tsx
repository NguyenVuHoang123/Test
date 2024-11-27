'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Checkbox, Stack, Autocomplete, TextField, CircularProgress, Select, InputLabel, FormControl, MenuItem } from '@mui/material';
import React from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SnackbarComponent from '../snackBar';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import UserService from 'src/@core/service/user';

// ----------------------------------------------------------------------


type props = {
    setOpenPopup: (open: boolean) => void;
    onSuccess: (message: string) => void;
}

export default function AddResUserGroup({ setOpenPopup, onSuccess }: props) {
    const settings: any = useSettingsContext();

    // State variables
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);


    const [customColor, setCustomColor] = useState('#000000');
    const [isCustom, setIsCustom] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('success');

    const colors = [
        { label: 'Xanh', value: '#0000FF' },
        { label: 'Đỏ', value: '#FF0000' },
        { label: 'Vàng', value: '#FFFF00' },
        { label: 'Tím', value: '#800080' },
        { label: 'Xanh Lá', value: '#008000' },
        { label: 'Hồng', value: '#FFC0CB' },
        { label: 'Cam', value: '#FFA500' },
        { label: 'Tùy chọn', value: 'custom' }
    ];

    const handleColorChange = (event: any) => {
        const value = event.target.value;
        setColor(value);
        setIsCustom(value === 'custom');
    };
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response: any = await UserService.getAllUsers();
                setUsers(response.data);
            } catch (error: any) {
                console.error('Error fetching users data:', error);
            }

        };
        fetchUser();
    }, []);

    const handleSubmit = async () => {
        if (groupName === '' || color === '' || selectedUsers.length === 0) {
            setSnackbarMessage('Vui lòng điền đầy đủ thông tin');
            setSnackbarStatus('error');
            setSnackbarOpen(true);
            setTimeout(()=>{setSnackbarOpen(false)},3000)
            return;
        }
        else {
            try {
                const data = {
                    groupName,
                    description,
                    color,
                    Users: selectedUsers.map((user: any) => ({
                        id: user.id,
                        userName: user.userName,
                    })),
                };
                const response = await ResponsibleGroupRoomService.createResponsibleGroups(data);
                if(response.status===200){
                    onSuccess("Tạo thành công");
                    setOpenPopup(false);
                }
            } catch (error: any) {
                setSnackbarMessage("Đã xảy ra lỗi, vui lòng thử lại sau");
                setSnackbarOpen(true);
                setSnackbarStatus('error');
                setTimeout(()=>{setSnackbarOpen(false)},3000)
            }
        }
    };


    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '10px' }}>
            <Box>
                <TextField
                    fullWidth
                    id="group-name"
                    label="Nhập tên nhóm"
                    variant="outlined"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </Box>
            <Box>
                <TextField
                    fullWidth
                    id="group-description"
                    label="Nhập mô tả nhóm phòng"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>
            <Box >
                <FormControl fullWidth>
                    <InputLabel id="color-select-label">Chọn màu</InputLabel>
                    <Select
                        labelId="color-select-label"
                        id="color-select"
                        value={color}
                        label="Chọn màu"
                        onChange={handleColorChange}
                        renderValue={(value) => (
                            <Box
                                sx={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: value === 'custom' ? customColor : value,
                                    display: 'inline-block',
                                    marginRight: 1,
                                }}
                            />
                        )}
                    >
                        {colors.map((color) => (
                            <MenuItem key={color.value} value={color.value}>
                                <Box
                                    sx={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: color.value !== 'custom' ? color.value : 'transparent',
                                        border: color.value === 'custom' ? '1px dashed gray' : 'none',
                                        display: 'inline-block',
                                        marginRight: 1,
                                    }}
                                />
                                {color.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {isCustom && (
                    <TextField
                        id="custom-color-picker"
                        label="Màu tùy chọn"
                        type="color"
                        variant="outlined"
                        value={customColor}
                        onChange={(e) => {
                            setCustomColor(e.target.value);
                            setColor(e.target.value);
                        }}
                        fullWidth
                        sx={{ mt: 1 }}
                    />
                )}
            </Box>
            <Box>
                <Autocomplete
                    multiple
                    fullWidth
                    options={users}
                    disableCloseOnSelect
                    getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}` || ''}
                    value={selectedUsers}
                    onChange={(event, newValue) => {
                        setSelectedUsers(newValue);
                        setUsers(prevUsers => {
                            const selectedIds = new Set(newValue.map(user => user.id));
                            return [...newValue, ...prevUsers.filter(user => !selectedIds.has(user.id))];
                        });
                    }}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.id}>
                            <Checkbox
                                key={`checkbox-${option.id}`}
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={selected || selectedUsers.some(user => user.id === option.id)}
                            />
                            {option.firstName} {option.lastName}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn người dùng"
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText="Không có dữ liệu người dùng"
                    loading={loading}
                    loadingText="Đang tìm kiếm..."
                />
            </Box>

            <Button onClick={handleSubmit} variant='contained'>Tạo</Button>
            <SnackbarComponent
                status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
                open={snackbarOpen}
                message={snackbarMessage}
            />
        </Container>
    );
}