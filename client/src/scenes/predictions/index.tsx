import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import { useGetKpisQuery } from '@/state/api';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React from 'react'
import regression, { DataPoint } from "regression";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Label } from 'recharts';



const Predictions = () => {

    const { palette } = useTheme();
    const [isPredictions, setIsPredictions] = React.useState(false);
    const { data: kpiData } = useGetKpisQuery();

    const formattedData = React.useMemo(() => {
        if (!kpiData) return [];

        const monthData = kpiData[0].monthlyData;
        const formatted: Array<DataPoint> = monthData.map(
            ({ revenue }, i: number) => {
                return [i, revenue]
            }
        );

        const regresisonLine = regression.linear(formatted);

        return monthData.map(({ month, revenue }, i: number) => {
            return {
                name: month,
                "Actual Revenue": revenue,
                "Regression Line": regresisonLine.predict(i)[1],
                "Predicted Revenue": regresisonLine.predict(i + 12)[1]
            }
        }
        );
    }, [kpiData]);

    return (
        <DashboardBox width="100%" height="100%" padding="1rem" overflow="hidden">
            <FlexBetween m="1rem 2.5rem" gap="1rem">
                <Box>
                    <Typography variant='h3'>Revenue and Predictions</Typography>
                    <Typography variant='h6'> Charted revenue and predicted revenue based on a simple linear regression model.</Typography>
                </Box>
                <Button onClick={() => setIsPredictions(!isPredictions)}
                    sx={{
                        color: palette.grey[900],
                        backgroundColor: palette.grey[700],
                        boxShadow: "0.1rem 0.1rem 0.1rem 0.1remvrgba(0,0,0,0.4)"
                    }}>
                    Show Predicted revenue for Next year
                </Button>
            </FlexBetween>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{
                        top: 20,
                        right: 75,
                        left: 20,
                        bottom: 80,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.grey[800]} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        style={{ fontSize: "10px" }}
                    >
                        <Label value="Month" position="insideBottom" offset={-5} />
                    </XAxis>
                    <YAxis
                        domain={[12000, 26000]}
                        axisLine={{ strokeWidth: '0' }}
                        style={{ fontSize: "10px" }}
                        tickFormatter={(value) => `$${value}`}
                    >
                        <Label value="Revenue in USD" position="insideLeft" angle={-90} offset={-5} />
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign='top' />
                    <Line
                        type="monotone"
                        dataKey="Actual Revenue"
                        stroke={palette.primary.main}
                        strokeWidth={0}
                        dot={{ strokeWidth: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Regression Line"
                        stroke="#8884d8"
                        dot={false}
                    />
                    {isPredictions && (
                        <Line
                            strokeDasharray="5 5"
                            dataKey="Predicted Revenue"
                            stroke={palette.secondary[500]}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </DashboardBox>
    )
}

export default Predictions