from setuptools import setup

setup(
    name="setupy-flake8",
    version="0.1.0",
    packages=["setupy_flake8"],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests~=2.26",
    ],
    extras_require={
        "dev": [
            "flake8~=4.0",
        ],
    },
)
