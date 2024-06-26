'use client'

import {CCard, CCardBody, CCardTitle, CCol, CRow, CWidgetStatsB,} from '@coreui/react-pro'
import {CChart} from "@coreui/react-chartjs";
import {getStyle} from "@coreui/utils";
import {useEffect, useState} from "react";
import {getAllHistoryService} from "@/services/historyService";
import {TradeHistory} from "@/app/interfaces/historyInterface";
import {formatNumber} from "@/app/common/helperMethods";

import { mean, standardDeviation } from 'simple-statistics';


const Dashboard = () => {

    const [history, setHistory] = useState<TradeHistory[]>([]);
    const [dashBoardStat, setDashBoardStat] = useState({
        balance: 0,
        noOfTrades: 0,
        noOfWins: 0,
        noOfLoss: 0,
        balanceLabels: [],
        balanceData: [],
        allProfit: 0,
        allLoss: 0,
        monthlyProfit: 0,
        monthlyLoss: 0,
        winRate: 0,
        profitFactor: 0,
        sharpRatio: 0,
        symbolLabels: [],
        symbolData: []
    })
    const [error, setError] = useState<Error | null>(null);

    const fetchHistory = async () => {
        const data = await getAllHistoryService();
        setHistory(data);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (history?.length > 0) {
            calculateDashboardStat();
        }
    }, [history]);

    const getCurrentMonthData = (history: TradeHistory[]) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return history.filter(entry => {
            const entryDate = new Date(entry.time * 1000);
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });
    }

    const getTradeProfitLossResult = (tradeArray: TradeHistory[]) => {
        return tradeArray.reduce((prev, next) => prev + next.profit + next.commission + next.swap + next.fee, 0)
    }

    const calculateSharpeRatio = (returns: number[], riskFreeRate = 0) => {
        const meanReturn = mean(returns);
        const stdDevReturn = standardDeviation(returns);
        return (meanReturn - riskFreeRate) / stdDevReturn;
    };

    const symbolCount = (tradeHistory: TradeHistory[]) =>  {
        const symbolCount = {};

        // Count occurrences of each symbol
        tradeHistory.forEach(trade => {
            if (symbolCount[trade.symbol]) {
                symbolCount[trade.symbol]++;
            } else {
                symbolCount[trade.symbol] = 1;
            }
        });

        // Prepare labels and data for the chart
        const symbolLabels = Object.keys(symbolCount);
        const symbolData = symbolLabels.map(symbol => symbolCount[symbol]);

        return { symbolLabels, symbolData };
    }

    const calculateCumulativeBalance = (tradeHistory: TradeHistory[]) => {
        let cumulativeBalance = 0;
        const balanceLabels = [];
        const balanceData = [];

        tradeHistory.forEach(trade => {
            cumulativeBalance += trade.profit + trade.commission + trade.swap + trade.fee;
            balanceLabels.push(new Date(trade.time * 1000).toLocaleDateString());
            balanceData.push(cumulativeBalance);
        });

        return { balanceLabels, balanceData };
    }


    const calculateDashboardStat = () => {
        const historyWithoutDeposit = history.filter(item => item?.symbol !== "");
        const currentMonthHistory = getCurrentMonthData(historyWithoutDeposit);
        const balance = history.reduce((prev, next) => {
            return prev + next.profit + next.commission + next.swap + next.fee;
        }, 0);
        const winArray = historyWithoutDeposit.filter(item => item?.profit >= 0);
        const lossArray = historyWithoutDeposit.filter(item => item?.profit < 0);
        const winArrayMonth = currentMonthHistory.filter(item => item?.profit >= 0);
        const lossArrayMonth = currentMonthHistory.filter(item => item?.profit < 0);

        const noOfTrades = historyWithoutDeposit?.length;
        const noOfWins = winArray.length;
        const noOfLoss = lossArray.length;
        const allProfit = getTradeProfitLossResult(winArray);
        const allLoss = getTradeProfitLossResult(lossArray);
        const monthlyProfit = getTradeProfitLossResult(winArrayMonth);
        const monthlyLoss = getTradeProfitLossResult(lossArrayMonth);
        const winRate = (noOfWins/ noOfTrades) * 100;
        const profitFactor = allProfit / allLoss;
        const returns = historyWithoutDeposit.map(next => next.profit + next.commission + next.swap + next.fee);
        const sharpRatio = calculateSharpeRatio(returns);
        const { symbolLabels, symbolData } = symbolCount(historyWithoutDeposit);
        const { balanceLabels, balanceData } = calculateCumulativeBalance(historyWithoutDeposit);

        setDashBoardStat({
            ...dashBoardStat,
            balance: formatNumber(balance, 2),
            noOfTrades,
            noOfWins,
            noOfLoss,
            balanceDataPoints: [],
            allProfit: formatNumber(allProfit, 2),
            allLoss: formatNumber(allLoss, 2),
            monthlyProfit: formatNumber(monthlyProfit, 2),
            monthlyLoss: formatNumber(monthlyLoss, 2),
            winRate: formatNumber(winRate, 2),
            profitFactor: formatNumber(profitFactor, 2),
            sharpRatio: formatNumber(sharpRatio, 2),
            symbolLabels,
            symbolData,
            balanceLabels,
            balanceData
        })
    }

    return (
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle>Trade and Balance Stats</CCardTitle>
                    <CRow>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="primary"
                                inverse
                                progress={{ value: 100 }}
                                text="Balance"
                                title="Current Balance"
                                value={dashBoardStat.balance}
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="primary"
                                inverse
                                progress={{ value: 100 }}
                                text="Trades"
                                title="No. of Trades"
                                value={dashBoardStat.noOfTrades}
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="success"
                                inverse
                                progress={{ value: 75 }}
                                text="Wins"
                                title="No. of win trades"
                                value={dashBoardStat.noOfWins}
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="danger"
                                inverse
                                progress={{ value: 75 }}
                                text="Losses"
                                title="No. lost trades"
                                value={dashBoardStat.noOfLoss}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12}>
                            <CChart
                                type="line"
                                data={{
                                    labels: dashBoardStat.balanceLabels,
                                    datasets: [
                                        {
                                            label: "Balance",
                                            backgroundColor: "rgba(220, 220, 220, 0.2)",
                                            borderColor: "rgba(220, 220, 220, 1)",
                                            pointBackgroundColor: "rgba(220, 220, 220, 1)",
                                            pointBorderColor: "#fff",
                                            data: dashBoardStat.balanceData
                                        },

                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: getStyle('--cui-body-color'),
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                color: getStyle('--cui-border-color-translucent'),
                                            },
                                            ticks: {
                                                color: getStyle('--cui-body-color'),
                                            },
                                        },
                                        y: {
                                            grid: {
                                                color: getStyle('--cui-border-color-translucent'),
                                            },
                                            ticks: {
                                                color: getStyle('--cui-body-color'),
                                            },
                                        },
                                    },
                                }}
                            />
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle> Profit Stats</CCardTitle>
                    <CRow>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="success"
                                inverse
                                progress={{ value: 100 }}
                                text="Profit"
                                title="All Profit"
                                value={dashBoardStat.allProfit}
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="danger"
                                inverse
                                progress={{ value: 100 }}
                                text="Loss"
                                title="All Losses"
                                value={dashBoardStat.allLoss}
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="success"
                                inverse
                                progress={{ value: 100 }}
                                text="Current Profit"
                                title="Profit in current month"
                                value={dashBoardStat.monthlyProfit}
                            />
                        </CCol>
                        <CCol xs={3}>
                            <CWidgetStatsB
                                className="mb-3"
                                color="danger"
                                inverse
                                progress={{ value: 100 }}
                                text="Current Loss"
                                title="Losses in current month"
                                value={dashBoardStat.monthlyLoss}
                            />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={3}>
                            <CChart
                                type="pie"
                                data={{
                                    labels: ['Profit', 'Loss'],
                                    datasets: [
                                        {
                                            backgroundColor: ['#1b9e3e', '#e55353'],
                                            data: [dashBoardStat.allProfit, dashBoardStat.allLoss],
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: 'black',
                                            }
                                        }
                                    },
                                }}
                            />
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle>Performance Metrics</CCardTitle>
                    <CRow>
                        <CCol xs={4}>
                            <CWidgetStatsB
                                className="mb-3"
                                progress={{ color: 'success', value: 75 }}
                                text="The ratio of winning trades to the total number of trades. It measures the frequency of successful trades in a trading strategy."
                                title="Win Rate"
                                value={dashBoardStat.winRate}
                            />
                        </CCol>
                        <CCol xs={4}>
                            <CWidgetStatsB
                                className="mb-3"
                                progress={{ color: 'success', value: 100 }}
                                text="Profit factor is the ratio of gross profits divided by gross losses. If the Profit factor is above 1, the trading system indicates profitability. The higher the Profit factor, the better."
                                title="Profit Factor"
                                value={dashBoardStat.profitFactor}
                            />
                        </CCol>
                        <CCol xs={4}>
                            <CWidgetStatsB
                                className="mb-3"
                                progress={{ color: 'success', value: 75 }}
                                text="The Sharpe ratio is a measure of risk-adjusted return. It indicates how much excess return is generated for each unit of risk taken. A higher Sharpe ratio indicates better risk-adjusted performance. Evaluate: < 1.0: Subpar, between 1.0 and 1.99: Acceptable/Good, between 2.0 and 2.99: Very good, >= 3.0: Excellent "
                                title="Sharp Ratio"
                                value={dashBoardStat.sharpRatio}
                            />
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardTitle>Symbols Stat</CCardTitle>
                    <CRow>
                        <CCol xs={5}>
                            <CChart
                                type="doughnut"
                                data={{
                                    labels: dashBoardStat.symbolLabels,
                                    datasets: [
                                        {
                                            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                                            data: dashBoardStat.symbolData,
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: 'black',
                                            }
                                        }
                                    },
                                }}
                            />
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}

export default Dashboard
