import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { z, ZodError } from 'zod';

import { Flex, Icon, Text, useToast } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';

import apiBackend from '../../../../shared/apis';
import Button from '../../../../shared/components/Button';
import Form from '../../../../shared/components/Form';
import Input from '../../../../shared/components/Input';
import InputCurrency from '../../../../shared/components/InputCurrency';
import Select from '../../../../shared/components/Select';
import TextArea from '../../../../shared/components/TextArea';
import TextEditor from '../../../../shared/components/TextEditor';
import TextUtils from '../../../../shared/utils/TextUtils';

const OrdersRegisterPage: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const [resources, setResources] = useState<any[]>([]);
  const [defaultResources, setDefaultResources] = useState<any[]>([]);
  const [showResources, setShowResources] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [document, setDocument] = useState('');

  const requiredFields = [
    '{{ NOME_RECORRENTE }}',
    '{{ CPF_RECORRENTE }}',
    '{{ EMAIL_RECORRENTE }}'
  ];

  const handleSubmit = useCallback(() => {
    try {
      const data = formRef.current?.getData() as any;

      if (!selectedResource) {
        toast({
          title: 'Selecione um recurso',
          description: '',
          status: 'error',
          duration: 4000,
          isClosable: true
        });
        return;
      }

      const schema = z.object({
        '{{ NOME_RECORRENTE }}': z
          .string()
          .min(1, { message: 'Nome do Recorrente obrigatório' }),
        '{{ CPF_RECORRENTE }}': z
          .string()
          .min(1, { message: 'CPF do Recorrente Obrigatório' }),
        '{{ EMAIL_RECORRENTE }}': z
          .string()
          .min(1, { message: 'Email do Recorrente é obrigatório' })
      });

      schema.parse(data);

      const session = localStorage.getItem('@tiramulta:session');

      const { user } = JSON.parse(session as string);

      const formatNumber = (value: string) => {
        return Number(value.replace(/\./g, '').replace(/,/, '.'));
      };

      apiBackend
        .post('/sales', {
          buyer: {
            name: data['{{ NOME_RECORRENTE }}'],
            document: data['{{ CPF_RECORRENTE }}'],
            telephone: data.buyer_telephone,
            email: data['{{ EMAIL_RECORRENTE }}']
          },
          dealer_id: user?.id,
          resource_id: selectedResource.id,
          tax_value: formatNumber(data.tax_value),
          discount: formatNumber(data.discount),
          document: data.document
        })
        .then(response => {
          const { status } = response;

          if (status === 201) {
            toast({
              title: 'Cadastro Realizado',
              description: '',
              status: 'success',
              duration: 4000,
              isClosable: true
            });

            navigate('/vendas');
          } else {
            toast({
              title: 'Ocorreu um erro',
              description: '',
              status: 'error',
              duration: 4000,
              isClosable: true
            });
          }
        });
    } catch (err) {
      if (err instanceof ZodError) {
        toast({
          title: 'Preencha corretamente',
          description: err.errors[0].message,
          status: 'error',
          duration: 4000,
          isClosable: true
        });
      }
    }
  }, [formRef, selectedResource, document]);

  const handleSearchResource = useCallback(
    (value: string) => {
      if (value) {
        const filtredResources = defaultResources.filter(item => {
          return String(item.name).toLowerCase().includes(value.toLowerCase());
        });

        setResources(filtredResources);
        setShowResources(true);
      } else {
        setResources(defaultResources);
        setShowResources(false);
      }
    },
    [defaultResources]
  );

  const handleClickResource = useCallback(
    (item: any) => {
      setSelectedResource(item);
      setShowResources(false);
      setDocument(item.document);
      const searchRef = formRef.current?.getFieldRef('search');
      searchRef.value = '';
    },
    [formRef]
  );

  const handleChangeTaxOrDiscount = useCallback(
    (type: string, value: string) => {
      const number = Number(
        String(value).replace(/\./g, '').replace(/,/g, '.')
      );

      console.log(type);
      if (type === 'TAX') {
        setTax(number);
      } else {
        setDiscount(number);
      }
    },
    []
  );

  const total = useMemo(() => {
    const resourceValue = Number(selectedResource?.value || 0);
    return resourceValue + tax - discount;
  }, [selectedResource, tax, discount]);

  const handleChangeField = useCallback(() => {
    let text = selectedResource.document;
    selectedResource.fields.forEach(field => {
      const input = formRef.current?.getFieldRef(field.flag);
      if (input.value)
        text = text.replace(new RegExp(`${field.flag}`, 'g'), input.value);
    });
    setDocument(text);
  }, [selectedResource, setDocument]);

  useEffect(() => {
    apiBackend.get('/resources').then(response => {
      const { status, data } = response;
      if (status === 200) {
        setResources(data);
        setDefaultResources(data);
      }
    });
  }, []);

  return (
    <Form ref={formRef}>
      <Flex width="100%" flexDirection="column">
        <Flex
          width="100%"
          flexDirection="column"
          color="gray.900"
          backgroundColor="white"
          p="32px"
        >
          <Text fontWeight="600" color="green.500" fontSize="14px" mb="13px">
            Nova Venda
          </Text>

          <Flex
            width="100%"
            justifyContent="space-between"
            flexDirection={'column'}
          >
            <Flex width={'100%'} flexDirection="column">
              <Flex
                width="48%"
                justifyContent="space-between"
                flexDirection={'column'}
              >
                <Flex width="100%" flexDirection="column">
                  <Text fontWeight="600" fontSize="14px" textAlign="center">
                    Recurso
                  </Text>
                  <Flex width={'100%'} position="relative">
                    <Flex width="100%" flexDirection="column">
                      <Input
                        name="search"
                        label="Pesquisar"
                        autoComplete="false"
                        autoCorrect="false"
                        autoCapitalize="false"
                        onKeyUp={e =>
                          handleSearchResource(e.currentTarget.value)
                        }
                        onClick={() => setShowResources(true)}
                      />

                      {selectedResource && (
                        <Flex width="100%" flexDirection="column">
                          <Flex
                            width="100%"
                            backgroundColor="green.500"
                            color="white"
                            px="8px"
                            py="8px"
                            mb="16px"
                            position="relative"
                          >
                            <Flex width="100%" justifyContent="space-between">
                              <Text>{selectedResource.name}</Text>
                              <Text mr="24px">
                                {TextUtils.formatCurrency(
                                  selectedResource.value
                                )}
                              </Text>
                            </Flex>
                            <Flex
                              position="absolute"
                              right="-4px"
                              top="-4px"
                              borderRadius="50%"
                              backgroundColor="red.500"
                              color="white"
                              cursor="pointer"
                              width="24px"
                              height="24px"
                              onClick={() => setSelectedResource(null)}
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Icon as={FiX} color="white" fontSize="14px" />
                            </Flex>
                          </Flex>
                        </Flex>
                      )}
                    </Flex>
                    {showResources && (
                      <Flex
                        width="100%"
                        flexDirection="column"
                        position="absolute"
                        backgroundColor={'white'}
                        top="56px"
                        zIndex={10000000}
                        maxHeight="200px"
                        overflow={'auto'}
                        boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
                      >
                        {resources.map(resource => (
                          <Flex
                            key={resource.id}
                            width="100%"
                            border="1px solid"
                            borderColor="gray.100"
                            fontSize="16px"
                            p="8px"
                            cursor={'pointer'}
                            _hover={{
                              backgroundColor: 'green.500',
                              color: 'white'
                            }}
                            justifyContent="space-between"
                            onClick={() => handleClickResource(resource)}
                          >
                            <Text>{resource.name}</Text>
                            <Text>
                              {TextUtils.formatCurrency(resource.value)}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Flex>

              {selectedResource && (
                <Flex width="100%">
                  <Flex width="100%" flexDirection="column">
                    <Flex width="100%" flexDirection="column">
                      <Text fontWeight="600">
                        Preencha os campos para pré-visualizar
                      </Text>

                      <Flex
                        width="100%"
                        flexDirection="row"
                        flexWrap="wrap"
                        justifyContent="space-between"
                      >
                        {selectedResource.fields.map(field => (
                          <Flex width="100%">
                            {field.type === 'TEXT' && (
                              <TextArea
                                key={field.flag}
                                name={field.flag}
                                label={field.field}
                                onKeyUp={() => handleChangeField()}
                                isRequired={requiredFields.includes(field.flag)}
                              />
                            )}

                            {field.type === 'SELECT' && (
                              <Select
                                key={field.flag}
                                name={field.flag}
                                label={field.field}
                                onChange={() => handleChangeField()}
                              >
                                <option>Selecione</option>
                                {field.options.map(option => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Select>
                            )}

                            {field.type === 'MULTISELECT' && (
                              <Select
                                key={field.flag}
                                name={field.flag}
                                label={field.field}
                                onChange={() => handleChangeField()}
                              >
                                <option>Selecione</option>
                                {field.options.map(option => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </Flex>
                        ))}
                      </Flex>
                    </Flex>

                    <Flex width="100%" mt="auto">
                      <Text fontWeight="600" mb="16pxpx">
                        Previsualização do Recurso
                      </Text>
                    </Flex>

                    <Flex width="100%">
                      <TextEditor
                        name="document"
                        isRequired
                        size="sm"
                        mb="4px"
                        height={400}
                        defaultValue={document}
                        isReadOnly={true}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              )}

              <Flex width="100%" mt="24px" justifyContent="flex-end">
                <Flex width="48%" justifyContent="space-between">
                  <Flex width={'48%'}>
                    <InputCurrency
                      name="discount"
                      label="Desconto"
                      onKeyUp={e =>
                        handleChangeTaxOrDiscount(
                          'DISCOUNT',
                          e.currentTarget.value
                        )
                      }
                    />
                  </Flex>
                  <Flex width={'48%'}>
                    <InputCurrency
                      name="tax_value"
                      label="Acréscimo"
                      onKeyUp={e =>
                        handleChangeTaxOrDiscount('TAX', e.currentTarget.value)
                      }
                    />
                  </Flex>
                </Flex>
              </Flex>

              <Flex
                width="100%"
                flexDirection="column"
                alignItems="flex-end"
                fontWeight="600"
                fontSize="14px"
              >
                <Flex gap="8px">
                  <Text>Valor do Recurso</Text>
                  <Text>
                    {TextUtils.formatCurrency(selectedResource?.value || 0)}
                  </Text>
                </Flex>
                <Flex gap="8px">
                  <Text>Valor do Desconto</Text>
                  <Text>{TextUtils.formatCurrency(discount)}</Text>
                </Flex>
                <Flex gap="8px">
                  <Text>Valor do Acréscimo</Text>
                  <Text>{TextUtils.formatCurrency(tax)}</Text>
                </Flex>
                <Flex gap="8px" fontSize="16px" color="green.500">
                  <Text>Total</Text>
                  <Text>{TextUtils.formatCurrency(total)}</Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex width="100%" justifyContent="center" mt="24px">
              <Button
                title="Salvar"
                backgroundColor="green.500"
                color="white"
                width="160px"
                borderRadius="4px"
                py="8px"
                onClick={() => handleSubmit()}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Form>
  );
};

export default OrdersRegisterPage;
