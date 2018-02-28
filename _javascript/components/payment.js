import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  expansion: {
    padding:0,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ControlledExpansionPanels extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
            expanded: null,
          };
  }
  

  handleChange(panel) { 
    return (event, expanded) => {
      this.setState({
        expanded: expanded ? panel : false,
      });
    };
  } 

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel  expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary className={classes.expansion} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Codigo de descuento</Typography>
            <Typography className={classes.secondaryHeading}>codigo de descuento por concurso</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>  
             tienes un codigo de descuento? agregalo aqui   
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel  expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary className={classes.expansion} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Efectivo</Typography>
            <Typography className={classes.secondaryHeading}>baloto,effective</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              informacion baloto effective
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
          <ExpansionPanelSummary className={classes.expansion} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Tarjeta de credito</Typography>
            <Typography className={classes.secondaryHeading}>
              Mastercard, visa
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FormControl className={classes.formControl}  fullWidth required>
              <InputLabel htmlFor="direccion">Direccion</InputLabel>
              <Input placeholder="crr # No # - #" autoComplete="section-blue shipping street-address" id="direccion"  onChange={() => { console.log("change")}} />
              <FormHelperText>Direccion del envio</FormHelperText>
            </FormControl>  
            <FormControl className={classes.formControl}  fullWidth required>
              <InputLabel htmlFor="direccion">Direccion</InputLabel>
              <Input placeholder="crr # No # - #" autoComplete="section-blue shipping street-address" id="direccion"  onChange={() => { console.log("change")}} />
              <FormHelperText>Direccion del envio</FormHelperText>
            </FormControl>  
            <FormControl className={classes.formControl}  fullWidth required>
              <InputLabel htmlFor="direccion">Direccion</InputLabel>
              <Input placeholder="crr # No # - #" autoComplete="section-blue shipping street-address" id="direccion"  onChange={() => { console.log("change")}} />
              <FormHelperText>Direccion del envio</FormHelperText>
            </FormControl>  
            <FormControl className={classes.formControl}  fullWidth required>
              <InputLabel htmlFor="direccion">Direccion</InputLabel>
              <Input placeholder="crr # No # - #" autoComplete="section-blue shipping street-address" id="direccion"  onChange={() => { console.log("change")}} />
              <FormHelperText>Direccion del envio</FormHelperText>
            </FormControl> 
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
          <ExpansionPanelSummary className={classes.expansion} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Tarjeta debito PSE</Typography>
            <Typography className={classes.secondaryHeading}>
              bancolombia,davivienda, banco popular
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              formulario PSE
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledExpansionPanels);