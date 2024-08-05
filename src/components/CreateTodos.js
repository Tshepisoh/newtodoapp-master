import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, FormControl, useTheme, OutlinedInput } from '@mui/material';

const CreateTodo = ({ handleSubmit }) => {
  const theme = useTheme();

  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        resetForm();
      }}
    >
      {({ handleChange, handleBlur, values }) => (
        <Form>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2,  }}>
            <FormControl sx={{ flexGrow: 1, }}>
              <OutlinedInput
                placeholder="Add Task..."
                required
                type="text"
                name="text"
                value={values.text}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ backgroundColor: 'white', borderRadius: 1, color: theme.dark ? "black" : "black" }}
              />
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 2, height: '100%' }}>
              Add
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CreateTodo;
