import unittest
from time import sleep
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
import random

class Testing(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.driver = webdriver.Chrome(ChromeDriverManager().install())
    
    def login(self, username, password):
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys(username)
        password.send_keys(password)
        password.send_keys(Keys.RETURN)
    
    def logout(self):
        self.driver.find_element_by_class_name("dropdown-toggle").click()
        self.driver.find_element_by_id("logout").click()

    '''
    Test 1 - Check if correct webpage loads with the correct title
    '''
    def test01(self):
        self.driver.get('http://localhost:8080')
        assert self.driver.title == "Auto Evaluation"

    '''
    Test 2 - To ensure invalid login are not permitted using 'PROF'
    '''
    def test02(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("UserThatDoesNotExist")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        try:
            WebDriverWait(self.driver, 3).until(EC.alert_is_present(), 'Timed out.')

            alert = self.driver.switch_to.alert
            alert.accept()
            
        except TimeoutException:
            assert False
    
    '''
    Test 3 - To ensure invalid password are not permitted using 'PROF'
    '''
    def test03(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PROF")
        password.send_keys("WrongPassword")
        password.send_keys(Keys.RETURN)
        try:
            WebDriverWait(self.driver, 3).until(EC.alert_is_present(), 'Timed out.')

            alert = self.driver.switch_to.alert
            alert.accept()
            
        except TimeoutException:
            assert False


    '''
    Test 4 - Check if user 'PROF' can login and access the professor hidden paths
    '''
    def test04(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PROF")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/evaluation')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Spurthi Anjan"
        sleep(1)
        self.driver.get('http://localhost:8080/showmarks')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Spurthi Anjan"
        self.logout()

    '''
    Test 5 - Check if user 'PES1201700134' can login and access the student hidden paths
    '''
    def test05(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PES1201700134")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/evaluation')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Parth Shah"
        sleep(1)
        self.driver.get('http://localhost:8080/showmarks')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Parth Shah"
        self.logout()
    
    '''
    Test 6 - Check if user 'PROF' can successfully create an assignment
    '''
    def test06(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PROF")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/evaluation')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Spurthi Anjan"

        assignmentID = self.driver.find_element_by_id("assignmentID")
        assignmentID.clear()
        assignmentID.send_keys("AS"+str(random.randint(0, 999)))

        assignmentName = self.driver.find_element_by_id("assignmentName")
        assignmentName.clear()
        assignmentName.send_keys("This is just an automatically created assignment.")

        maxMarks = self.driver.find_element_by_id("maxMarks")
        maxMarks.clear()
        maxMarks.send_keys("10")

        # Course ommitted

        question = self.driver.find_element_by_name("question")
        question.clear()
        question.send_keys("What is the point in writing tests after developing an application?")

        sampleAns = self.driver.find_element_by_name("sampleAns")
        sampleAns.clear()
        sampleAns.send_keys("There is absolutely no point. We should be taught test-driven development which we are not. Pointless.")

        self.driver.find_element_by_id("create").click()
        sleep(1)
        assert True
        self.logout()

    '''
    Test 7 - Check if user 'PROF' can retreive assignmentID that does not exist.
    Test 7.1 - Check if user 'PROF' can retreive assignmentID that exists.
    '''
    def test07(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PROF")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/showmarks')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Spurthi Anjan"

        assignmentID = self.driver.find_element_by_id("assignmentID")
        assignmentID.clear()
        assignmentID.send_keys("ThisIsNotAnAssignmentID")

        self.driver.find_element_by_class_name("btn-success").click()
        sleep(1)
        
        assignmentID = self.driver.find_element_by_id("assignmentID")
        assignmentID.clear()
        assignmentID.send_keys("AS01")

        self.driver.find_element_by_class_name("btn-success").click()
        sleep(1)
        assert True
        self.logout()
    
    '''
    Test 8 - Check if user 'PES1201700134' can successfully submit an assignment
    '''
    def test08(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PES1201700134")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/evaluation')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Parth Shah"

        usn = self.driver.find_element_by_id("usn")
        usn.clear()
        usn.send_keys("PES1201700134")

        assignmentID = self.driver.find_element_by_id("assignmentID")
        assignmentID.clear()
        assignmentID.send_keys("AS414")

        assignment = self.driver.find_element_by_name("ans")
        assignment.clear()
        assignment.send_keys("There really is no point of these assignments. College should not give us extra work during our summer break.")

        self.driver.find_element_by_class_name("btn-info").click()
        sleep(1)
        assert True
        self.logout()
    
    '''
    Test 9 - Check if user 'PES1201700134' can successfully check marks of an assignment
    '''
    def test09(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PES1201700134")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/showmarks')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Parth Shah"

        # USN is autofilled

        assignmentID = self.driver.find_element_by_id("assignmentID")
        assignmentID.clear()
        assignmentID.send_keys("AS414")

        self.driver.find_element_by_class_name("btn-info").click()
        sleep(1)
        assert True
        self.logout()
    
    '''
    Test 10 - Check if user 'PROF' can start the auto evaluation.
    '''
    def test10(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PROF")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/evaluation')
        sleep(1)
        name = self.driver.find_element_by_id("displayName").text
        assert name == "Hey Spurthi Anjan"

        self.driver.find_element_by_class_name("btn-info").click()
        sleep(5)
        assert False, "Error: Error!"
        self.logout()
    
    
    '''
    Test 11 - Check if error is displayed if a page that does not exist is accessed
    '''
    def test11(self):
        self.driver.get('http://localhost:8080/URLThatDoesNotExist')
        sleep(1)
        message = self.driver.find_element_by_class_name("lead").text
        
        assert message == "Page not found"
    
    '''
    Test 12 - Check if user 'PROF' can retreive multiple copies of the same assignment
    '''
    def test12(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PROF")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/showmarks')
        sleep(1)
        assignmentID = self.driver.find_element_by_id("assignmentID")
        assignmentID.clear()
        assignmentID.send_keys("AS02")

        send = self.driver.find_element_by_class_name("btn-success")
        send.click()
        send.click()
        send.click()
        send.click()
        send.click()
        sleep(1)
        table = self.driver.find_element_by_id("mytable")

        if(table):
            self.logout()
            assert False, "Too many elements."


    '''
    Test 13 - Check if user 'PES1201700134' can retreive multiple copies of the same assignment
    '''
    def test13(self):
        self.driver.get('http://localhost:8080')
        usn = self.driver.find_element_by_name("usn")
        password = self.driver.find_element_by_name("password")
        usn.clear()
        password.clear()
        usn.send_keys("PES1201700134")
        password.send_keys("ADMIN")
        password.send_keys(Keys.RETURN)
        sleep(1)
        self.driver.get('http://localhost:8080/showmarks')
        sleep(1)
        assignmentID = self.driver.find_element_by_id("assignmentID")
        assignmentID.clear()
        assignmentID.send_keys("AS02")

        send = self.driver.find_element_by_class_name("btn-info")
        send.click()
        send.click()
        send.click()
        send.click()
        send.click()
        sleep(1)
        table = self.driver.find_element_by_id("myStudentTable")

        if(table):
            self.logout()
            assert False, "Too many elements."

    @classmethod
    def tearDownClass(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
