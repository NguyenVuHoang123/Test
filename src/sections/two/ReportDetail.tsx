"use client"
import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CleaningReportService from 'src/@core/service/cleaningReport';

import ReportDetail from '../components/table/reportDetail';
import { useSettingsContext } from 'src/components/settings';
import BreadCrumbsComponent from '../components/BreadCrumbs';



const ReportDetailView = ({ id }: { id: string }) => {
  const items = [
    {
      title: 'Danh sách tiêu chí',
      link: '/dashboard/two'
    },
    {
      title: 'Chi tiết',
      link: `/detail/${id}`
    }
  ]
  const [report, setReport] = useState<any>(null);
  const theme = useTheme();
  const settings = useSettingsContext();
  useEffect(() => {
    const fetchData = async () => {
      const response = await CleaningReportService.getCleaningReportById(id);
      setReport(response.data);
    }
    fetchData();
  }, [id]);
  if (!report) {
    return
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
     
      <Box sx={{ marginY: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h3" sx={{
            flexGrow: 1,
            textAlign: 'center',
          }}>Báo cáo vệ sinh</Typography>
           <BreadCrumbsComponent items={items} />
        </Box>
       
        <Button
          variant="contained"
          onClick={() => window.location.href = `/dashboard/two/edit/${id}`}
          sx={{
            boxShadow: theme.shadows[3],
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: theme.shadows[10],
              transform: 'translateY(-2px)',
            },
          }}
        >
          Chỉnh sửa
        </Button>
      </Box>
      <ReportDetail report={report} />
    </Container>
  );
};

export default ReportDetailView;
