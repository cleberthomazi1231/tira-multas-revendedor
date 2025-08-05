import { format, parseISO } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'react-google-charts';
import { FiFileText } from 'react-icons/fi';

import { Divider, Flex, Icon, Text } from '@chakra-ui/react';

import apiBackend from '../apis';
import Card from '../components/Card';
import Form from '../components/Form';
import TextUtils from '../utils/TextUtils';

const Dashboard: React.FC = () => {
    const formRef = useRef();
    const [orders, setOrders] = useState<any[]>([]);
    const FIELDS = [
        {
            name: 'Cliente',
            maxWidth: '100%'
        },
        {
            name: 'Status',
            maxWidth: '100%'
        },
        {
            name: 'Valor',
            maxWidth: '100%'
        },
        {
            name: 'Dia/Hora',
            maxWidth: '100%'
        },
        {
            name: 'Ação',
            maxWidth: '120px'
        }
    ];

    const data = [
        ['Ano', 'Vendas', 'Lucro'],
        ['2021', 660, 300],
        ['2022', 1030, 350],
        ['2023', 1030, 350]
    ];

    const options = {
        chart: {
            title: 'Comparativo por Ano',
            subtitle: ''
        }
    };

    useEffect(() => {
        apiBackend.get('/sales').then(response => {
            const { status, data } = response;
            if (status === 200) setOrders(data);
        });
    }, []);

    return (
        <Flex width="100%" flexDirection="column">
            <Flex
                width="100%"
                flexWrap={['nowrap', 'nowrap', 'nowrap', 'wrap']}
                overflow="auto"
                minHeight={'140px'}
            >
                <Card title="Vendas Hoje" value={'0'} color="blue.500" />

                <Card
                    title="Total vendido"
                    value={'R$ 0,00'}
                    color="blue.500"
                />
                <Card
                    title="Total vendido no mês "
                    value={`R$ 0,00`}
                    color="blue.500"
                />
            </Flex>

            <Form ref={formRef}>
                <Flex width="100%" flexDirection="column" mt="24px">
                    <Flex
                        width="100%"
                        flexDirection="column"
                        backgroundColor="white"
                        p="16px"
                    >
                        <Flex width="100%" justifyContent="space-between">
                            <Text fontWeight="600" color="green.500">
                                Últimas Vendas
                            </Text>
                        </Flex>

                        <Divider my="16px" />

                        {orders.length <= 0 && (
                            <Text>Nenhuma venda no momento</Text>
                        )}

                        {orders.length > 0 && (
                            <Flex
                                width="100%"
                                flexDirection="column"
                                overflowX="auto"
                            >
                                <Flex width="100%">
                                    {FIELDS.map(field => (
                                        <Flex
                                            key={field.name}
                                            width="100%"
                                            maxWidth={field.maxWidth}
                                            fontSize="14px"
                                            fontWeight="600"
                                        >
                                            <Text>{field.name}</Text>
                                        </Flex>
                                    ))}
                                </Flex>
                                <Flex
                                    width="100%"
                                    flexDirection="column"
                                    fontSize="14px"
                                >
                                    {orders.map(item => (
                                        <Flex key={item} width="100%" py="8px">
                                            <Flex width="100%" maxWidth="100%">
                                                <Text>{item.buyer.name}</Text>
                                            </Flex>

                                            <Flex width="100%" maxWidth="100%">
                                                <Text>
                                                    {TextUtils.convertEventStatus(
                                                        item.status
                                                    )}
                                                </Text>
                                            </Flex>

                                            <Flex width="100%" maxWidth="100%">
                                                <Text>
                                                    {TextUtils.formatCurrency(
                                                        item.total_value
                                                    )}
                                                </Text>
                                            </Flex>

                                            <Flex width="100%" maxWidth="100%">
                                                <Text>
                                                    {format(
                                                        parseISO(
                                                            item.created_at
                                                        ),
                                                        'dd/MM/yy - HH:mm'
                                                    )}
                                                </Text>
                                            </Flex>

                                            <Flex width="100%" maxWidth="120px">
                                                <a
                                                    href={`https://app.recursofacil.com.br/sales/${item.id}/pdf`}
                                                    download={`${item.id}.pdf`}
                                                    target="_blank"
                                                >
                                                    <Icon
                                                        as={FiFileText}
                                                        fontSize="18px"
                                                        color="black"
                                                    />
                                                </a>
                                            </Flex>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Flex>
                        )}
                    </Flex>

                    <Flex mt="16px">
                        <Flex
                            width="988%"
                            p="24px"
                            justifyContent="space-between"
                            backgroundColor="white"
                            alignItems="center"
                            overflow="hidden"
                        >
                            <Chart
                                chartType="Bar"
                                width="100%"
                                height="400px"
                                data={data}
                                options={options}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Form>
        </Flex>
    );
};

export default Dashboard;
