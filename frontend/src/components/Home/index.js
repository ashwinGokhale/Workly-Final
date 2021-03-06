import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { err } from '../../constants';
import { sendFlashMessage, clearFlashMessages, fetchJobs } from '../../actions';
import { Header } from '../Common';
import JobTable from './JobTable';

class HomePage extends Component {
	static propTypes = {
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		getJobs: PropTypes.func.isRequired,
		token: PropTypes.string
	};

	static defaultProps = {
		token: ''
	};

	constructor(props) {
		super(props);
		this.state = {
			jobs: [],
			loading: true
		};
	}

	componentDidMount = async () => {
		const { clear, flash, getJobs } = this.props;
		console.log('Home page props:', this.props);
		try {
			clear();
			const jobs = await getJobs();
			this.setState({ loading: false, jobs });
		} catch (error) {
			clear();
			this.setState({ loading: false });
			return flash(err(error));
		}
	};

	viewJob = id => this.props.history.push(`/jobs/${id}`);

	render() {
		return (
			<div>
				<Header />
				<h1 className="center">Workly</h1>
				<JobTable {...this.state} viewJob={this.viewJob} />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(
	mapStateToProps,
	{
		flash: sendFlashMessage,
		clear: clearFlashMessages,
		getJobs: fetchJobs
	}
)(HomePage);
