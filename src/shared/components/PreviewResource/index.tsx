import { useCallback, useEffect, useRef, useState } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { FormHandles } from '@unform/core';

import Form from '../Form';
import Select from '../Select';
import TextArea from '../TextArea';
import TextEditor from '../TextEditor';

const PreviewResource: React.FC<any> = ({
  resource,
  document,
  setDocument
}) => {
  const [original] = useState(resource.document);
  const formRef = useRef<FormHandles>(null);

  const handleChangeField = useCallback(() => {
    let text = original;
    resource.fields.forEach(field => {
      const input = formRef.current?.getFieldRef(field.flag);
      if (input.value)
        text = text.replace(new RegExp(`${field.flag}`, 'g'), input.value);
    });
    setDocument(text);
  }, [original, resource, setDocument]);

  useEffect(() => {
    setDocument(resource.document);
  }, []);

  return (
    <Form ref={formRef} style={{ width: '100%' }}>
      <Flex width="100%" flexDirection="column">
        <Flex width="100%" flexDirection="column">
          <Text fontWeight="600">Preencha os campos para pré-visualizar</Text>

          <Flex
            width="100%"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
          >
            {resource.fields.map(field => (
              <Flex width="100%">
                {field.type === 'TEXT' && (
                  <TextArea
                    key={field.flag}
                    name={field.flag}
                    label={field.field}
                    onKeyUp={() => handleChangeField()}
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
            onChange={e => setDocument(e.value)}
            defaultValue={document}
            isReadOnly={true}
          />
        </Flex>
      </Flex>
    </Form>
  );
};

export default PreviewResource;
