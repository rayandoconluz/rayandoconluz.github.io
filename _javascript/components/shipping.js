import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Downshift from 'downshift';
import Colombia from '../colombia.json'


const departamentos = Object.keys(Colombia)
const ciudades = Colombia['Antioquia']



function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      {...other}
      inputRef={ref}
      fullWidth
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...InputProps,
      }}
    />
  );
}

function renderSuggestion(params) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = params;
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem === suggestion;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion}
    </MenuItem>
  );
}

function getSuggestions(inputValue,suggestions) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue || suggestion.toLowerCase().includes(inputValue.toLowerCase())) &&
      count < 3;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

const styles = {
  container: {
    flexGrow: 1
  },
};

function IntegrationDownshift(props) {
  const { classes } = props;

  return (
    <div>
    <FormControl className={classes.formControl}  fullWidth required>
        <InputLabel htmlFor="nombre">Nombre</InputLabel>
        <Input placeholder="pepito perez" autoComplete="section-blue shipping street-address" id="nombre"  onChange={() => { console.log("change")}} />
    </FormControl> 
    <FormControl className={classes.formControl} fullWidth disabled>
        <Input id="name-disabled" value="Colombia" onChange={() => { console.log("change")}} />
      <FormHelperText>Envios solo a colombia</FormHelperText>
      </FormControl>
      <Downshift>
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'departamento',
                id: 'departamento-input',
              }),
            })}
            {isOpen ? (
              <Paper square>
                {getSuggestions(inputValue,departamentos).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
      <Downshift>
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'ciudad',
                id: 'ciudad-input',
              }),
            })}
            {isOpen ? (
              <Paper square>
                {getSuggestions(inputValue, ciudades).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
      <FormControl className={classes.formControl}  fullWidth required>
        <InputLabel htmlFor="direccion">Direccion</InputLabel>
        <Input placeholder="crr # No # - #" autoComplete="section-blue shipping street-address" id="direccion"  onChange={() => { console.log("change")}} />
        <FormHelperText>Direccion del envio</FormHelperText>
      </FormControl>  
    </div>  
  );
}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationDownshift);