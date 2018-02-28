import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Payment from './payment'
import Shipping from './shipping'
import Confirmation from './confirmation'


const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['Datos de envio', 'Datos de pago', 'Confirmacion'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Shipping />
    case 1: 
      return <Payment />
    case 2:
      return <Confirmation />;
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  constructor(props) { 
    super(props)
    this.state = {
      activeStep: 0
    };
  }
  handleNext() {
    return () => { 
      this.setState({
        activeStep: this.state.activeStep + 1
      });
    }
  };

  handleBack() {
    return () => { 
      this.setState({
        activeStep: this.state.activeStep - 1
      });
    }
  };

  handleReset() {
    return () => { 
      this.setState({
        activeStep: 0
      });
    }
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {getStepContent(index)}
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack()}
                        className={classes.button}
                      >
                        Atras
                      </Button>
                      <Button
                        variant="raised"
                        color="primary"
                        onClick={this.handleNext()}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Pagar' : 'Siguiente'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset()} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(VerticalLinearStepper);