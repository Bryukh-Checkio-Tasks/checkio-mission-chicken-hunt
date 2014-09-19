from checkio.referees.multicall import CheckiORefereeMulti
from checkio.signals import PROCESS_ENDED
from checkio import api
from checkio.api import DEFAULT_FUNCTION

from checkio.runner_types import SIMPLE


REQ = 'req'
REFEREE = 'referee'


class CheckioRefereeMultiSeveral(CheckiORefereeMulti):
    def __init__(self, quantity=2, **kwargs):
        self.quantity = quantity
        self.run_count = 0
        super().__init__(**kwargs)

    def on_ready(self, data):
        self.code = data['code']
        self.runner = data['runner']
        self.start_env()

        # for i in range(self.quantity):
        api.add_process_listener(REQ + str(0), PROCESS_ENDED, self.process_req_ended)

    def start_env(self, data=None):
        if self.run_count >= self.quantity:
            callback = self.run_success
            self.run_count = 0
        else:
            self.run_count += 1
            callback = self.start_env
        api.start_runner(code=self.code,
                         runner=self.runner,
                         prefix=REQ + str(self.run_count),
                         controller_type=SIMPLE,
                         callback=callback,
                         errback=self.fail_cur_step,
                         add_close_builtins=self.add_close_builtins,
                         add_allowed_modules=self.add_allowed_modules,
                         remove_allowed_modules=self.remove_allowed_modules,
                         write_execute_data=False,
                         cover_code=self.cover_code.get(self.runner))

    def run_success(self, data):
        self.current_step = 0
        self.current_category = self.get_current_env_name()
        api.request_write_start_in(self.current_category)
        self.referee_data = self.initial_referee(self.tests[self.current_category])

        self.test_current_step()

    def test_current_step(self, data=None):
        input_name = "input" + str(self.run_count)
        if self.run_count:

            self.referee_data["recent_results"].append(data["result"])
        else:
            self.referee_data["recent_results"] = []
        if self.run_count >= self.quantity - 1:
            callback = self.check_current_test
            self.current_step += 1
            self.run_count = 0
        else:
            self.run_count += 1
            callback = self.test_current_step
        self.referee_data["step"] = self.current_step
        if not self.run_count:
            api.request_write_in(self.referee_data["input"], REQ)
        api.execute_function(input_data=self.referee_data[input_name],
                             callback=callback,
                             errback=self.fail_cur_step,
                             func=self.function_name,
                             prefix=REQ + str(self.run_count))

    def check_current_test(self, data):

        self.referee_data["recent_results"].append(data["result"])
        self.referee_data = self.process_referee(self.referee_data)

        referee_result = self.referee_data.get("result", False)

        is_win_result = self.referee_data.get("is_win", False)

        api.request_write_ext(self.referee_data)

        if not referee_result:
            return api.fail(self.current_step, self.get_current_test_fullname())

        if not is_win_result:
            self.test_current_step()
        else:
            if self.next_env():
                self.restart_env()
            else:
                api.success()

    def restart_env(self):
        self.restarting_env = True
        for i in range(self.quantity):
            api.kill_runner(REQ + str(i))

    def process_req_ended(self, data):
        print("sdasdasdasdsadsadasdas", data)
        if self.restarting_env:
            self.restarting_env = False
            self.start_env()
        else:
            api.fail(self.current_step, self.get_current_test_fullname())
